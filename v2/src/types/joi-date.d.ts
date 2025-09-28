declare module "@hapi/joi-date" {
    import { Root } from "joi";
    const extension: (joi: Root) => any;
    export = extension;
}
