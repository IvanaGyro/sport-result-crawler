import { autoImplements } from './utilities';
export var Game;
(function (Game) {
    Game[Game["TAIWAN_INTERCOLLEGIATE_GAMES"] = 1] = "TAIWAN_INTERCOLLEGIATE_GAMES";
})(Game || (Game = {}));
export var Sport;
(function (Sport) {
    Sport[Sport["TRACK"] = 1] = "TRACK";
    Sport[Sport["FIELD"] = 2] = "FIELD";
})(Sport || (Sport = {}));
export var EventType;
(function (EventType) {
    EventType[EventType["RUN_400_METRES"] = 1] = "RUN_400_METRES";
})(EventType || (EventType = {}));
export var Category;
(function (Category) {
    Category[Category["FEMALE"] = 1] = "FEMALE";
    Category[Category["MALE"] = 2] = "MALE";
    Category[Category["MIXED"] = 3] = "MIXED";
    Category[Category["OPEN"] = 4] = "OPEN";
})(Category || (Category = {}));
export var Round;
(function (Round) {
    Round[Round["PRELIMINARY"] = 1] = "PRELIMINARY";
    Round[Round["SEMI_FINAL"] = 2] = "SEMI_FINAL";
    Round[Round["FINAL"] = 3] = "FINAL";
})(Round || (Round = {}));
/**
 * Class of sport events
 */
export default class Event extends autoImplements() {
}
