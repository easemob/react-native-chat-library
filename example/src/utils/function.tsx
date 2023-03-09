import type { PromiseType, UnPromisify } from 'react-native-chat-uikit';

export function promiseWrapper<T>(params: {
  f: PromiseType<T>;
  args: any;
  ft?: string;
  onSuccess?: (data: UnPromisify<typeof params.f>) => void;
  onError?: (error: any) => void;
}): void {
  params
    .f(params.args)
    .then((result) => {
      params.onSuccess?.(result);
    })
    .catch((error) => {
      if (params.onError) {
        params.onError?.(error);
      } else {
        console.warn('test:promiseWrapper:error:', params.f.name, error);
      }
    });
}
