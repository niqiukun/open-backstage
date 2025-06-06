export class EnumDefinition<
  Name extends string,
  T extends readonly { key: string; label: string }[],
> {
  name: Name;
  definition: T;

  constructor(name: Name, enumDefinition: T) {
    this.name = name;
    this.definition = enumDefinition;
  }
}

export class ListDefinition<
  T extends
    | readonly Property<any>[]
    | PrimitiveType
    | EnumDefinition<string, any>,
> {
  definition: T;
  options: ListOptions<T>;

  constructor(listDefinition: T, options: ListOptions<T> = {}) {
    this.definition = listDefinition;
    this.options = options;
  }
}

type PrimitiveType = 'text' | 'timestamp' | 'boolean' | 'integer';

export type PropertyType =
  | PrimitiveType
  | ListDefinition<any>
  | EnumDefinition<string, any>;

export type Property<
  Type extends PropertyType,
  Name extends string = string,
> = {
  key: Name;
  label?: string;
  type: Type;
  optional?: boolean;
};

type EntityConfig<Props extends readonly Property<any>[]> = {
  label?: string;
  properties: Props;
  constraints?: {
    unique?: Array<Array<Props[number]['key']> | Props[number]['key']>;
  };
  enumOptions?: {
    labelField?: Props[number]['key'];
    valueField?: Props[number]['key'];
  };
  dataSource?:
    | {
        type: 'nuxt';
      }
    | {
        type: 'fixed';
        data: ExtractTypeFromProps<Props>[];
      };
};

export class EntityDefinition<
  Name extends string,
  T extends EntityConfig<any>,
> {
  name: Name;
  definition: T;

  constructor(name: Name, entityDefinition: T) {
    this.name = name;
    this.definition = entityDefinition;
  }
}

type PrimitiveTypeMap = {
  text: string;
  timestamp: number;
  boolean: boolean;
  integer: number;
};

type ExtractTypeFromProps<T extends readonly Property<any>[]> = {
  [K in T[number] as K['key']]: K['type'] extends PrimitiveType
    ? PrimitiveTypeMap[K['type']]
    : K['type'] extends ListDefinition<any>
      ? ExtractTypeFromList<K['type']>
      : K['type'] extends EnumDefinition<string, any>
        ? ExtractTypeFromEnum<K['type']>
        : never;
};

type ExtractItemTypeFromListConfig<T> = T extends PrimitiveType
  ? PrimitiveTypeMap[T]
  : T extends readonly Property<any>[]
    ? ExtractTypeFromProps<T>
    : never;
type ExtractTypeFromListConfig<T> = T extends PrimitiveType
  ? Array<PrimitiveTypeMap[T]>
  : T extends readonly Property<any>[]
    ? Array<ExtractTypeFromProps<T>>
    : never;
type ExtractTypeFromList<T> =
  T extends ListDefinition<infer U> ? ExtractTypeFromListConfig<U> : never;

type ExtractTypeFromEnum<T> =
  T extends EnumDefinition<infer _, infer U>
    ? U extends ReadonlyArray<{ key: string; label: string }>
      ? U[number]['key']
      : never
    : never;

export type ExtractType<T> =
  T extends EntityDefinition<infer _, infer config>
    ? config extends EntityConfig<infer Props>
      ? ExtractTypeFromProps<Props>
      : never
    : T extends EnumDefinition<infer _, infer config>
      ? ExtractTypeFromEnum<config>
      : never;

export function defineEntity<
  Name extends string,
  const T extends readonly Property<any>[],
>(
  name: Name,
  entity: EntityConfig<T>
): EntityDefinition<Name, EntityConfig<T>> {
  return new EntityDefinition(name, entity);
}

export function defineEnum<
  Name extends string,
  const T extends { key: string; label: string }[],
>(name: Name, enumDefinition: T): EnumDefinition<Name, T> {
  return new EnumDefinition(name, enumDefinition);
}

type ListOptions<
  T extends
    | readonly Property<any>[]
    | PrimitiveType
    | EnumDefinition<string, any>,
> = {
  table?: {
    displayFormat?: 'tag' | 'comma-separated';
    displayLimit?: number;
    itemToString?: (value: ExtractItemTypeFromListConfig<T>) => string;
  };
};

export function listOf<
  const T extends ReadonlyArray<Property<any>> | PrimitiveType,
>(type: T, options: ListOptions<T> = {}) {
  return new ListDefinition(type, options);
}

export function enumFrom<const T extends EntityDefinition<string, any>>(
  entity: T
): EnumDefinition<T['name'], readonly { key: string; label: string }[]> {
  if (!entity.definition.enumOptions) {
    throw new Error(`Entity ${entity.name} does not have enumOptions defined`);
  }
  if (entity.definition.dataSource?.type !== 'fixed') {
    throw new Error(`Entity ${entity.name} does not have fixed data source`);
  }
  return new EnumDefinition(
    entity.name,
    entity.definition.dataSource.data.map((item: any) => ({
      key: item[entity.definition.enumOptions.valueField],
      label: item[entity.definition.enumOptions.labelField],
    }))
  );
}

export function isList(
  property: Property<any>
): property is Property<any> & { type: ListDefinition<any> } {
  return property.type instanceof ListDefinition;
}

export function isEnum(
  property: Property<any>
): property is Property<any> & { type: EnumDefinition<string, any> } {
  return property.type instanceof EnumDefinition;
}

type FilterByType<T extends readonly any[], U> = T extends readonly [
  infer First,
  ...infer Rest,
]
  ? First extends U
    ? [First, ...FilterByType<Rest, U>]
    : FilterByType<Rest, U>
  : [];

type EntitiesToMap<T extends readonly EntityDefinition<string, any>[]> = {
  [K in T[number] as K extends EntityDefinition<infer Name, infer _>
    ? Name
    : never]: K;
};
type EnumsToMap<T extends readonly EnumDefinition<string, any>[]> = {
  [K in T[number] as K extends EnumDefinition<infer Name, infer _>
    ? Name
    : never]: K;
};

export function defineCollection<
  const T extends Array<
    EntityDefinition<string, any> | EnumDefinition<string, any>
  >,
>(list: T) {
  const entities: Record<string, EntityDefinition<string, any>> = {},
    enums: Record<string, EnumDefinition<string, any>> = {};
  for (const item of list) {
    if (item instanceof EnumDefinition) {
      enums[item.name] = item;
    } else if (item instanceof EntityDefinition) {
      entities[item.name] = item;
    }
  }
  return {
    entities: entities as unknown as EntitiesToMap<
      FilterByType<T, EntityDefinition<string, any>>
    >,
    enums: enums as unknown as EnumsToMap<
      FilterByType<T, EnumDefinition<string, any>>
    >,
    getEntity(
      name: string
    ): EntityDefinition<string, EntityConfig<readonly Property<any>[]>> {
      const entity = entities[name];
      if (!entity) {
        throw new Error(`Entity ${name} not found`);
      }
      return entity;
    },
  };
}
