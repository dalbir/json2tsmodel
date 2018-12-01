import 'reflect-metadata'
import { CastConfig } from './decorators/cast'
import { IRelationInfo } from './decorators/relations'
import { KEYS, RELATION } from './constants'

export class BaseModel {
  /**
   * reference to the orginal api data
   */
  protected _raw: any = {}

  /**
   * Triggered when the changed function is called instructing subscribers that item is updated
   */

  /**
   * Parse JSON data to Model Class
   * Based on @Cast decorator
   *
   * @param json JSON Data
   */
  public cast(json: any) {
    const self = (this as unknown) as BaseModel & { [key: string]: string }

    const properties: { [key: string]: CastConfig } = Reflect.getMetadata(KEYS.CONFIG, this) || {}

    this._raw = json

    for (const propertyKey in properties) {
      const castConfig: CastConfig = properties[propertyKey]

      if (!castConfig.from) {
        continue
      }

      let castValue = json[castConfig.from]

      const relationInfo = Reflect.getMetadata(KEYS.RELATIONS, this, propertyKey)
      if (relationInfo) {
        castValue = this.setupRelations(relationInfo, castValue)
      }

      if (castConfig.convert && castValue !== undefined) {
        castValue = castConfig.convert.apply(this, [castValue, this._raw])
      }
      if (castValue !== undefined) {
        self[propertyKey] = castValue
      }
    }

    return this
  }

  /**
   *
   */
  public toJson(): Object {
    const self = (this as unknown) as BaseModel & { [key: string]: any }
    const resultJson: { [key: string]: any } = {}
    const properties: { [key: string]: CastConfig } = Reflect.getMetadata(KEYS.CONFIG, this) || {}

    for (const key in properties) {
      let propertyValue = self[key]

      const info = properties[key]

      if (!info.from || typeof propertyValue === 'undefined' || info.readOnly) {
        continue
      }

      const relationInfo = Reflect.getMetadata('json2tsmodel:casting:relations', this, key)
      if (relationInfo) {
        switch (relationInfo.type) {
          case RELATION.HASONE:
            propertyValue = self[key].toJson()
            break
          case RELATION.HASMANY:
            propertyValue = propertyValue.map((v: BaseModel) => v.toJson())
            break
        }
      }
      resultJson[info.from] = propertyValue
    }

    return resultJson
  }

  private setupRelations(relationInfo: IRelationInfo, json: any): any | undefined {
    if (!json) {
      {
        return undefined
      }
    }

    switch (relationInfo.type) {
      case RELATION.HASONE:
        return new (relationInfo.model as any)().cast(json)
      case RELATION.HASMANY:
        const items = []
        for (const key in json) {
          if (json.hasOwnProperty(key)) {
            items.push(new (relationInfo.model as any)().cast(json[key]))
          }
        }
        return items
    }
  }
}
