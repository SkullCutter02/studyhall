import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import merge from "lodash.merge";

@Injectable()
export class TransformIncludeQueryPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): any {
    const splittedValue = value.split(",");
    let obj = {};

    for (const v of splittedValue) {
      const query = v.split(".");

      obj = merge(obj, buildQuery(query, {}, true));

      function buildQuery(q: string[], o: any, isFirst: boolean): object {
        if (q.length === 0) return o.include;

        return buildQuery(q.slice(0, -1), { include: { [q[q.length - 1]]: isFirst ? true : { ...o } } }, false);
      }
    }

    return obj;
  }
}
