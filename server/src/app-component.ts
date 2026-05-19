import { Component, Singleton } from "@anvil-di/anvil";
import type { RouteDefinition } from "@anvil-di/bellows";
import { RoutesModule } from "./routes.module.anvil.js";
import { TodoModule } from "./todo-module.js";
import { OpenApiModule } from "./schema-route.module.anvil.js";
import type { TodoService } from "./todo-service.js";

@Singleton
@Component({ modules: [TodoModule, RoutesModule, OpenApiModule] })
export abstract class AppComponent {
  abstract routeDefinitions(): Set<RouteDefinition>;
  abstract todoService(): TodoService;
}
