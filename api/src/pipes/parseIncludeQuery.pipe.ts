import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import merge from "lodash.merge";

@Injectable()
export class ParseIncludeQueryPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): any {
    if (!value) return value;

    if (typeof value !== "string") throw new BadRequestException("Include query is not a string");

    const splittedValue = value.split(",");
    let obj = {};

    for (const v of splittedValue) {
      const query = v.split(".");

      obj = merge(obj, buildQuery(query, {}, true));

      function buildQuery(q: string[], o: any, isFirst: boolean): object {
        if (q.length === 0) return o.include;

        if (q[q.length - 1] === "info") {
          return buildQuery(q.slice(0, -1), o, false);
        } else {
          return buildQuery(q.slice(0, -1), { include: { [q[q.length - 1]]: isFirst ? true : { ...o } } }, false);
        }
      }
    }

    return obj;
  }
}
