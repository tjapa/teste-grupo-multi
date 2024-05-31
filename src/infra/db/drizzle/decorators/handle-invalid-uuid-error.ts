export function HandleInvalidUuidError(
  target: any,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<any>,
): TypedPropertyDescriptor<any> {
  const originalMethod = descriptor.value

  descriptor.value = async function (...args: any[]) {
    try {
      return await originalMethod.apply(this, args)
    } catch (error: any) {
      if (error?.message?.includes('invalid input syntax for type uuid')) {
        return undefined
      }
      throw error
    }
  }

  return descriptor
}
