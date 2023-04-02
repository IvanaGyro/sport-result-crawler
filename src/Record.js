import { autoImplements } from './utilities';
export var Gender;
(function (Gender) {
    Gender[Gender["MALE"] = 1] = "MALE";
    Gender[Gender["FEMALE"] = 2] = "FEMALE";
    Gender[Gender["NON_BINARY"] = 3] = "NON_BINARY";
})(Gender || (Gender = {}));
export default class Record extends autoImplements() {
}
