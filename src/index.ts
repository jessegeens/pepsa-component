/**
 * A new GetOperationHandler, that gets executed instead of the old one
 * This OperationHandler not only fetches the resource from the store,
 * but then also applies privacy-enhancing transformations to it
 */
export * from "./server/CustomAuthorizingHttpHandler";
