import { KEYS } from "../constants";

export type CastCallback = ((value?: any, raw?: any) => any);
export interface CastConfig {
    from?: string;
    convert?: CastCallback;
    readOnly?: boolean;
}

/**
 * Describes Model property alias for json response
 */
export function Cast(a?: string, b?: CastCallback): (t:any,p:string|symbol) => void;
export function Cast(a?: CastCallback): (t:any,p:string|symbol) => void;
export function Cast(a?: string | CastCallback, b?: CastCallback): (t:any,p:string|symbol) => void {

    let from;
    let convert;

    if (typeof a === 'function') {
        convert = a;
    } else { from = a; convert = b; }
    const config: CastConfig = { from, convert };

    return function (target: any, propertyKey: string | symbol) {

        config.from = config.from || propertyKey as string;

        const propertiesConfig = Reflect.getMetadata(KEYS.CONFIG, target) || {};
        propertiesConfig[propertyKey] = config;

        Reflect.defineMetadata(KEYS.CONFIG, propertiesConfig, target);
    };
}

/**
 * Describes specific property as readonly.
 * ReadOnly properties are gonna excluded while generated json for the model instance using .toJson method
 * Using @ReadOnly decorator order is important and it should be used only before @Cast().
 * @param target
 * @param propertyKey
 */
export function ReadOnly(target: any, propertyKey: string) {
    try {
        const propertiesConfig = Reflect.getMetadata(KEYS.CONFIG, target);
        propertiesConfig[propertyKey].readOnly = true;
    } catch {
        throw new Error(`@Cast decorator is missing after @ReadOnly for ${propertyKey} in ${target.constructor.name}`);
    }
}
