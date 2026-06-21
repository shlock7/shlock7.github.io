---
title: 使用 Spring MCP Server Boot Starter 快速构建一个 MCP 服务
timestamp: 2026-06-20 16:54:33
# series: MCP 网关
tags: [MCP, LLM]
description: 基于 Spring AI 框架，实现一个简单的 MCP 服务，为后续做mcp协议的分析和验证进行使用。
toc: true
---

## 前言

Spring AI 框架提供了 MCP Server Boot Starter，方便我们快速开发一个 MCP 服务，官方文档地址：https://docs.spring.io/spring-ai/reference/api/mcp/mcp-server-boot-starter-docs.html

基于 Java 实现 MCP 协议，可以有 2 种方式：

- **stdio 模式**：以 jar 包形式提供，本地引入使用。不需要自己启动 Spring Boot 服务，把 jar 给提供出去，别人本地配置引入即可使用。但这种方式不太适合做统一网关服务。
- **SSE 模式**：基于 HTTP 的 Server-Sent Events 协议，服务独立部署，客户端通过网络连接。适合做统一网关服务，也是本文的重点。

下面我们使用 MCP Server Boot Starter 快速创建一个基于 SSE 协议的 MCP 服务，提供一个贷款审批额度查询工具，模拟银行或金融机构的贷款审批场景。

## 快速开始

### 1. 创建项目，引入依赖

创建一个 Spring Boot 项目，Java 版本选择 17，然后在 `pom.xml` 中引入以下依赖：

```xml
<properties>
    <spring-ai.version>1.0.0</spring-ai.version>
</properties>

<!-- 包管理，不做引入 -->
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-bom</artifactId>
            <version>${spring-ai.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>

<dependencies>
    <!-- MCP Server 核心依赖 -->
    <dependency>
        <groupId>org.springframework.ai</groupId>
        <artifactId>spring-ai-starter-mcp-server</artifactId>
    </dependency>

    <!-- 基于 WebFlux 的 SSE 传输层 -->
    <dependency>
        <groupId>org.springframework.ai</groupId>
        <artifactId>spring-ai-starter-mcp-server-webflux</artifactId>
    </dependency>

    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

关键依赖说明：

- `spring-ai-starter-mcp-server`：MCP Server 核心，提供自动配置、`@Tool` 注解、`ToolCallbackProvider` 等能力
- `spring-ai-starter-mcp-server-webflux`：提供基于 WebFlux 的 SSE 传输层，引入后自动配置 SSE 端点

### 2. 配置 application.yml

```yaml
server:
    port: 8701
    servlet:
        encoding:
            charset: UTF-8
            force: true
            enabled: true

spring:
    application:
        name: ai-mcp-gateway-demo-mcp-server-test
    main:
        banner-mode: off
        # 取消注释会禁用 web 容器，配合 stdio 模式使用，sse 模式需要 web 容器
        # web-application-type: none
    ai:
        mcp:
            server:
                name: ${spring.application.name}
                version: 1.0.0
                # 异步处理工具调用
                type: ASYNC
                # 给MCP客户端的说明，告诉 ai 这个服务能提供什么能力
                instructions: "This server provides loan approval tools. Call the '获取审批额度' tool with loan application info and credit level to get an approval amount."
                # SSE 消息端点路径。MCP 客户端通过 http://localhost:8701/sse 建立 SSE 连接
                # 然后向 /mcp/messages 发送 JSON-RPC 消息
                sse-message-endpoint: /mcp/messages
                capabilities:
                    tool: true
                    resource: true
                    prompt: true
                    completion: true

logging:
    # stdio 模式打开，sse 模式，注释掉。
    # 取消注释会清空控制台日志格式，禁止控制台输出日志，通常用于 stdio 模式，因为日志会输出到 stdout 影响协议
    #  pattern:
    #    console:
    file:
        name: data/log/${spring.application.name}.log
```

重点配置说明：

| 配置项                                      | 说明                                                         |
| ------------------------------------------- | ------------------------------------------------------------ |
| `server.port`                               | HTTP 服务端口，客户端通过 `http://localhost:{port}/sse` 连接 |
| `spring.ai.mcp.server.name`                 | MCP 服务器名称，客户端连接时可见                             |
| `spring.ai.mcp.server.type`                 | 运行模式：`ASYNC`（异步）或 `SYNC`（同步）                   |
| `spring.ai.mcp.server.instructions`         | 给 AI 模型的指令，描述服务器提供什么能力                     |
| `spring.ai.mcp.server.sse-message-endpoint` | SSE 消息端点路径                                             |
| `spring.ai.mcp.server.capabilities`         | 能力开关：tool / resource / prompt / completion              |

### 3. 编写 DTO 类

DTO 类决定了 MCP 工具的参数 Schema，大模型通过这些描述来理解如何调用工具。现在我们假设通过客户的贷款信息，以及我们风控模型对客户的评级，就可以计算出客户可通过的贷款申请额度，那么我们需要以下两个类：

**贷款申请请求：**

```java
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoanApplyRequest {

    @JsonProperty(required = true, value = "userId")
    @JsonPropertyDescription("用户ID")
    private String userId;

    @JsonProperty(required = true, value = "applyInfo")
    @JsonPropertyDescription("贷款申请信息")
    private ApplyInfo applyInfo;

    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ApplyInfo {

        @JsonProperty(required = true, value = "applyAmt")
        @JsonPropertyDescription("申请金额, 请保留两位小数 例如 1234.12")
        private String applyAmt;

        @JsonProperty(required = true, value = "loanType")
        @JsonPropertyDescription("贷款类型")
        private String loanType;

        @JsonProperty(required = true, value = "applyTerm")
        @JsonPropertyDescription("申请期限")
        private String applyTerm;
    }
}
```

**信用等级请求：**

```java
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreditLevelRequest {

    @JsonProperty(required = true, value = "userId")
    @JsonPropertyDescription("用户ID")
    private String userId;

    @JsonProperty(required = true, value = "creditLevel")
    @JsonPropertyDescription("客户评级, 可分为A,B,C,D四个等级")
    private String creditLevel;
}
```

这个 MCP 服务的响应，就是客户的贷款申请额度：

**审批额度响应：**

```java
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApprovalAmountResponse {

    @JsonProperty(required = true, value = "approvalAmt")
    @JsonPropertyDescription("审批金额, 请保留两位小数 例如 1234.12")
    private String approvalAmt;
}
```

注解说明：

| 注解                                        | 作用                                                        |
| ------------------------------------------- | ----------------------------------------------------------- |
| `@JsonInclude(NON_NULL)`                    | 序列化时忽略 null 字段，保持输出简洁                        |
| `@JsonProperty(required=true, value="...")` | 定义 JSON 字段名，并标记为必填参数                          |
| `@JsonPropertyDescription("...")`           | **关键注解**，定义参数描述，AI 模型通过这个描述理解参数含义 |

### 4. 编写 MCP Tool 服务

Spring AI 的核心设计：**只需在普通 Spring Service 方法上加 `@Tool` 注解，就能将其暴露为 MCP 工具**。

```java
@Slf4j
@Service
public class LoanAmountService {

    @Tool(description = "获取审批额度")
    public ApprovalAmountResponse getApprovalAmount(
            LoanApplyRequest loanApplyRequest,
            CreditLevelRequest creditLevelRequest) {
        log.info("getApprovalAmount loanApplyRequest: {}, creditLevelRequest: {}", loanApplyRequest, creditLevelRequest);

        // 模拟审批逻辑，返回随机额度
        ApprovalAmountResponse response = new ApprovalAmountResponse();
        response.setApprovalAmt(new Random().longs(10000).toString());
        return response;
    }
}
```

- `@Service`：标准 Spring 注解，将类注册为 Spring Bean
- `@Tool(description = "获取审批额度")`：**核心注解**，将方法暴露为 MCP 工具，`description` 是 AI 模型看到的工具描述
- 方法参数的 Schema 由 DTO 上的 `@JsonProperty` 和 `@JsonPropertyDescription` 自动生成
- 方法返回值自动序列化为 JSON 返回给 MCP 客户端

#### `@Tool`注解

MCP 服务的实现，就类似 Spring 中写一个 Service，但是没有了RequestMapping，多了`@Tool`注解，看一下这个注解

```java
@Target({ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Tool {
    String name() default "";

    String description() default "";

    boolean returnDirect() default false;

    Class<? extends ToolCallResultConverter> resultConverter() default DefaultToolCallResultConverter.class;
}
```

可以指定工具的名称，描述，直接返回标识和结果转换器

- 名称就是这个 MCP 的名字
- 大模型会根据描述来理解 MCP 的用途，并决定何时调用这个 MCP
- returnDirect是个直接返回标识，
- resultConverter是自定义的工具调用结果转换器，可以将方法返回值转换为 MCP 协议需要的格式

### 5. 注册工具到 MCP 服务器

在 Spring Boot 启动类中，通过 `MethodToolCallbackProvider` 将 Service 注册为 MCP 工具：

```java
@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public ToolCallbackProvider toolCallbackProvider(LoanAmountService loanAmountService) {
        return MethodToolCallbackProvider.builder()
                .toolObjects(loanAmountService)
                .build();
    }
}
```

工作原理：

1. `MethodToolCallbackProvider` 扫描传入的 `toolObjects` 中所有 `@Tool` 注解的方法
2. 为每个方法生成对应的 `ToolCallback`，包含工具名称、描述、参数 Schema
3. Spring AI MCP Server 自动将这些 `ToolCallback` 注册到 MCP 协议层
4. MCP 客户端连接后即可发现并调用这些工具

### 6. 启动与测试

服务启动后，MCP SSE 端点为：`http://localhost:8701/sse`

使用 MCP 客户端（如 Claude Desktop、Cursor 等）连接该端点，即可发现并调用"获取审批额度"工具。

## 完整数据流

```
MCP 客户端（AI 模型）
    │
    │ SSE 连接: http://localhost:8701/sse
    │ 发送 JSON-RPC: /mcp/messages
    ▼
Spring AI MCP Server（自动配置）
    │
    │ ToolCallbackProvider → MethodToolCallbackProvider
    ▼
LoanAmountService.getApprovalAmount()
    │
    │ @Tool 注解方法
    ▼
ApprovalAmountResponse（JSON 序列化返回）
```

## 如何添加新的 MCP 工具

只需 3 步：

1. **定义 DTO**：在 `model` 包下创建请求/响应类，使用 `@JsonPropertyDescription` 描述每个字段
2. **编写方法**：在 Service 类中添加 `@Tool(description="...")` 注解的方法
3. **完成**：方法自动被注册为 MCP 工具，无需额外配置

## stdio 模式切换

如果需要以 stdio 模式运行（适用于本地 jar 引入场景），修改 `application.yml`：

```yaml
spring:
    main:
        # 禁用 Web 容器
        web-application-type: none

logging:
    # 清空控制台日志格式，防止日志输出到 stdout 干扰 MCP 协议
    pattern:
        console:
```

## AI 总结

Spring AI MCP Server Boot Starter 极大地简化了 MCP 服务的开发：

- **零协议代码**：不需要手动处理 MCP 协议细节，全部由框架自动完成
- **注解驱动**：`@Tool` + `@JsonPropertyDescription` 即可定义工具和参数
- **Spring Boot 原生**：与 Spring 生态无缝集成，享受自动配置、依赖注入等能力
- **多传输层**：一行配置切换 stdio / SSE 模式
