import { UseMutationOptions, UseMutationResult, useMutation } from "@tanstack/react-query";

// Utility types for mutation options and results
type CreateMutationOptions<TFn extends (...args: any) => any, TContext = unknown> = Omit<
  UseMutationOptions<Awaited<ReturnType<TFn>>, unknown, Parameters<TFn>[0], TContext>,
  "mutationFn" | "mutationKey"
>;

type CreateMutationResult<
  TFn extends (...args: any) => any,
  TContext = unknown
> = UseMutationResult<Awaited<ReturnType<TFn>>, unknown, Parameters<TFn>[0], TContext>;

/** */
/**
 * Creates a configurable mutation hook using the provided mutation function and options.
 *
 * @template TFn - The type of the mutation function.
 * @template TContext - The type of the context.
 *
 * @param {TFn} mutationFn - The mutation function to be executed.
 * @param {readonly unknown[]} [mutationKey] - Optional key to uniquely identify the mutation.
 * @param {CreateMutationOptions<TFn, TContext>} [options={}] - Default options for the mutation.
 *
 * @returns {Function} A function that accepts additional options and returns a mutation result.
 *
 * @example
 * const useMyMutation = createConfigurableMutation(myMutationFn, ['myMutationKey'], {
 *   onSuccess: (data) => console.log('Mutation successful', data),
 *   onError: (error) => console.error('Mutation failed', error),
 * });
 *
 * const { mutate } = useMyMutation({
 *   onSuccess: (data) => console.log('Additional success handler', data),
 * });
 */
export function createConfigurableMutation<TFn extends (variables: any) => any, TContext = unknown>(
  mutationFn: TFn,
  mutationKey?: readonly unknown[],
  options: CreateMutationOptions<TFn, TContext> = {}
) {
  return (
    configuredOptions: CreateMutationOptions<TFn, TContext> = {}
  ): CreateMutationResult<TFn, TContext> =>
    useMutation({
      mutationFn: async (variables) => await mutationFn(variables),
      mutationKey,
      ...options,
      ...configuredOptions,
      onError(error, variables, context) {
        options.onError?.(error, variables, context);
        configuredOptions.onError?.(error, variables, context);
      },
      onSuccess(data, variables, context) {
        options.onSuccess?.(data, variables, context);
        configuredOptions.onSuccess?.(data, variables, context);
      },
      onSettled(data, error, variables, context) {
        options.onSettled?.(data, error, variables, context);
        configuredOptions.onSettled?.(data, error, variables, context);
      },
    });
}
