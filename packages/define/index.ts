type PropertyType = 'string' | 'timestamp';

type Property<Name extends string = string> = {
  name: Name;
  type: PropertyType;
};

type EntityConfig<Props extends ReadonlyArray<Property>> = {
  name: string;
  properties: Props;
  constraints?: {
    unique?: Array<Props[number]['name']>;
  };
};

export function defineEntity<T extends ReadonlyArray<Property>>(entity: EntityConfig<T>) {
  return entity;
};
