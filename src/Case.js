import { autoImplements } from './utilities';
// If severity of one case is INJURY_ONLY_OR_DEATH_BETWEEN_2_TO_30_DAYS, it means we cannot
// distinguish whether the case is a DEATH_BETWEEN_2_TO_30_DAYS case or a INJURY_ONLY case
// from the dataset.
export var Severity;
(function (Severity) {
    Severity[Severity["DEATH_IN_24_HOURS"] = 1] = "DEATH_IN_24_HOURS";
    Severity[Severity["DEATH_BETWEEN_2_TO_30_DAYS"] = 2] = "DEATH_BETWEEN_2_TO_30_DAYS";
    Severity[Severity["INJURY_ONLY_OR_DEATH_BETWEEN_2_TO_30_DAYS"] = 3] = "INJURY_ONLY_OR_DEATH_BETWEEN_2_TO_30_DAYS";
    Severity[Severity["INJURY_ONLY"] = 4] = "INJURY_ONLY";
    Severity[Severity["ONLY_PROPERTY_DAMAGE"] = 5] = "ONLY_PROPERTY_DAMAGE";
    Severity[Severity["SELF_SETTLEMENT"] = 6] = "SELF_SETTLEMENT";
})(Severity || (Severity = {}));
export var Weather;
(function (Weather) {
    Weather[Weather["STROM"] = 1] = "STROM";
    Weather[Weather["STRONG_WIND"] = 2] = "STRONG_WIND";
    Weather[Weather["SAND_WIND"] = 3] = "SAND_WIND";
    Weather[Weather["SMOKE"] = 4] = "SMOKE";
    Weather[Weather["SNOWE"] = 5] = "SNOWE";
    Weather[Weather["RAIN"] = 6] = "RAIN";
    Weather[Weather["CLOUDY"] = 7] = "CLOUDY";
    Weather[Weather["SUNNY"] = 8] = "SUNNY";
})(Weather || (Weather = {}));
export var Light;
(function (Light) {
    Light[Light["DAYTIME"] = 1] = "DAYTIME";
    Light[Light["SUNRISE_SUNSET"] = 2] = "SUNRISE_SUNSET";
    Light[Light["NIGHT_LIGHTING"] = 3] = "NIGHT_LIGHTING";
    Light[Light["NIGHT_DARK"] = 4] = "NIGHT_DARK";
})(Light || (Light = {}));
export var RoadHierarchy;
(function (RoadHierarchy) {
    RoadHierarchy[RoadHierarchy["FREEWAY"] = 1] = "FREEWAY";
    RoadHierarchy[RoadHierarchy["PROVINCIAL"] = 2] = "PROVINCIAL";
    RoadHierarchy[RoadHierarchy["COUNTY"] = 3] = "COUNTY";
    RoadHierarchy[RoadHierarchy["COUNTRY"] = 4] = "COUNTRY";
    RoadHierarchy[RoadHierarchy["CITY"] = 5] = "CITY";
    RoadHierarchy[RoadHierarchy["VILLAGE"] = 6] = "VILLAGE";
    RoadHierarchy[RoadHierarchy["EXCLUDED"] = 7] = "EXCLUDED";
    RoadHierarchy[RoadHierarchy["OTHER"] = 8] = "OTHER";
})(RoadHierarchy || (RoadHierarchy = {}));
export var RoadGeometry;
(function (RoadGeometry) {
    RoadGeometry[RoadGeometry["OPEN_LEVEL_CROSSING"] = 1] = "OPEN_LEVEL_CROSSING";
    RoadGeometry[RoadGeometry["BARRIER_LEVEL_CROSSING"] = 2] = "BARRIER_LEVEL_CROSSING";
    RoadGeometry[RoadGeometry["THREE_WAY_INTERSECTION"] = 3] = "THREE_WAY_INTERSECTION";
    RoadGeometry[RoadGeometry["CROSS_INTERSECTION"] = 4] = "CROSS_INTERSECTION";
    RoadGeometry[RoadGeometry["MULTIWAY_INTERSECTION"] = 5] = "MULTIWAY_INTERSECTION";
    RoadGeometry[RoadGeometry["TUNNEL"] = 6] = "TUNNEL";
    RoadGeometry[RoadGeometry["UNDERPASS"] = 7] = "UNDERPASS";
    RoadGeometry[RoadGeometry["BRIDGE"] = 8] = "BRIDGE";
    RoadGeometry[RoadGeometry["CULVERT"] = 9] = "CULVERT";
    RoadGeometry[RoadGeometry["VIADUCT"] = 10] = "VIADUCT";
    RoadGeometry[RoadGeometry["CURVE"] = 11] = "CURVE";
    RoadGeometry[RoadGeometry["SLOPE"] = 12] = "SLOPE";
    RoadGeometry[RoadGeometry["ALLEY"] = 13] = "ALLEY";
    RoadGeometry[RoadGeometry["STRAIGHT"] = 14] = "STRAIGHT";
    RoadGeometry[RoadGeometry["OTHER"] = 15] = "OTHER";
    RoadGeometry[RoadGeometry["ROUNDABOUT"] = 16] = "ROUNDABOUT";
    RoadGeometry[RoadGeometry["SQUARE"] = 17] = "SQUARE";
})(RoadGeometry || (RoadGeometry = {}));
export var Position;
(function (Position) {
    Position[Position["INTERSECTION"] = 1] = "INTERSECTION";
    Position[Position["NEARBY_INTERSECTION"] = 2] = "NEARBY_INTERSECTION";
    Position[Position["HOOK_TURN_AREA"] = 3] = "HOOK_TURN_AREA";
    Position[Position["BIKE_STOP_AREA"] = 4] = "BIKE_STOP_AREA";
    Position[Position["TRAFFIC_ISLAND"] = 5] = "TRAFFIC_ISLAND";
    Position[Position["U_TURN"] = 6] = "U_TURN";
    Position[Position["FAST_LANE"] = 7] = "FAST_LANE";
    Position[Position["SLOW_LANE"] = 8] = "SLOW_LANE";
    Position[Position["NORMAL_LANE"] = 9] = "NORMAL_LANE";
    Position[Position["BUS_LANE"] = 10] = "BUS_LANE";
    Position[Position["MOTORCYCLE_LANE"] = 11] = "MOTORCYCLE_LANE";
    Position[Position["MOTORCYCLE_FIRST_LANE"] = 12] = "MOTORCYCLE_FIRST_LANE";
    Position[Position["ROAD_SHOULDER"] = 13] = "ROAD_SHOULDER";
    Position[Position["ACCELERATION_LANE"] = 14] = "ACCELERATION_LANE";
    Position[Position["DECELERATION_LANE"] = 15] = "DECELERATION_LANE";
    Position[Position["STRAIGHT_RAMP"] = 16] = "STRAIGHT_RAMP";
    Position[Position["BEND_RAMP"] = 17] = "BEND_RAMP";
    Position[Position["PEDESTRIAN_CROSSING"] = 18] = "PEDESTRIAN_CROSSING";
    Position[Position["NEARBY_PEDESTRIAN_CROSSING"] = 19] = "NEARBY_PEDESTRIAN_CROSSING";
    Position[Position["SIDEWALK"] = 20] = "SIDEWALK";
    Position[Position["TOLLGATE"] = 21] = "TOLLGATE";
    Position[Position["OTHER"] = 22] = "OTHER";
})(Position || (Position = {}));
export var RoadMaterial;
(function (RoadMaterial) {
    RoadMaterial[RoadMaterial["ASPHALT"] = 1] = "ASPHALT";
    RoadMaterial[RoadMaterial["CONCRETE"] = 2] = "CONCRETE";
    RoadMaterial[RoadMaterial["GRAVEL"] = 3] = "GRAVEL";
    RoadMaterial[RoadMaterial["OTHER"] = 4] = "OTHER";
    RoadMaterial[RoadMaterial["NONE"] = 5] = "NONE";
})(RoadMaterial || (RoadMaterial = {}));
export var RoadSurfaceWet;
(function (RoadSurfaceWet) {
    RoadSurfaceWet[RoadSurfaceWet["SNOW"] = 1] = "SNOW";
    RoadSurfaceWet[RoadSurfaceWet["OIL"] = 2] = "OIL";
    RoadSurfaceWet[RoadSurfaceWet["MUD"] = 3] = "MUD";
    RoadSurfaceWet[RoadSurfaceWet["WET"] = 4] = "WET";
    RoadSurfaceWet[RoadSurfaceWet["DRY"] = 5] = "DRY";
})(RoadSurfaceWet || (RoadSurfaceWet = {}));
export var RoadSurfaceDefect;
(function (RoadSurfaceDefect) {
    RoadSurfaceDefect[RoadSurfaceDefect["SOFT"] = 1] = "SOFT";
    RoadSurfaceDefect[RoadSurfaceDefect["CORRUGATION"] = 2] = "CORRUGATION";
    RoadSurfaceDefect[RoadSurfaceDefect["HOLE"] = 3] = "HOLE";
    RoadSurfaceDefect[RoadSurfaceDefect["NONE"] = 4] = "NONE";
})(RoadSurfaceDefect || (RoadSurfaceDefect = {}));
export var Obstacle;
(function (Obstacle) {
    Obstacle[Obstacle["UNDER_CONSTRUCTION"] = 1] = "UNDER_CONSTRUCTION";
    Obstacle[Obstacle["STUFF"] = 2] = "STUFF";
    Obstacle[Obstacle["PARKING"] = 3] = "PARKING";
    Obstacle[Obstacle["OTHER"] = 4] = "OTHER";
    Obstacle[Obstacle["NONE"] = 5] = "NONE";
})(Obstacle || (Obstacle = {}));
export var SightDistance;
(function (SightDistance) {
    SightDistance[SightDistance["BEND"] = 1] = "BEND";
    SightDistance[SightDistance["SLOPE"] = 2] = "SLOPE";
    SightDistance[SightDistance["BUILDING"] = 3] = "BUILDING";
    SightDistance[SightDistance["PLANT"] = 4] = "PLANT";
    SightDistance[SightDistance["PARKING"] = 5] = "PARKING";
    SightDistance[SightDistance["OTHER"] = 6] = "OTHER";
    SightDistance[SightDistance["GOOD"] = 7] = "GOOD";
})(SightDistance || (SightDistance = {}));
export var TrafficSignal;
(function (TrafficSignal) {
    TrafficSignal[TrafficSignal["NORMAL"] = 1] = "NORMAL";
    TrafficSignal[TrafficSignal["NORMAL_WITH_WALKING_PERSON"] = 2] = "NORMAL_WITH_WALKING_PERSON";
    TrafficSignal[TrafficSignal["FLASH"] = 3] = "FLASH";
    TrafficSignal[TrafficSignal["NONE"] = 4] = "NONE";
})(TrafficSignal || (TrafficSignal = {}));
export var TrafficSignalStatus;
(function (TrafficSignalStatus) {
    TrafficSignalStatus[TrafficSignalStatus["NORMAL"] = 1] = "NORMAL";
    TrafficSignalStatus[TrafficSignalStatus["UNUSUAL"] = 2] = "UNUSUAL";
    TrafficSignalStatus[TrafficSignalStatus["NO_ACTION"] = 3] = "NO_ACTION";
    TrafficSignalStatus[TrafficSignalStatus["NO_TRAFFIC_LIGHT"] = 4] = "NO_TRAFFIC_LIGHT";
})(TrafficSignalStatus || (TrafficSignalStatus = {}));
export var DirectionDivider;
(function (DirectionDivider) {
    DirectionDivider[DirectionDivider["WIDE_ISLAND"] = 1] = "WIDE_ISLAND";
    DirectionDivider[DirectionDivider["NARROW_ISLAND_WITH_BARRIER"] = 2] = "NARROW_ISLAND_WITH_BARRIER";
    DirectionDivider[DirectionDivider["NARROW_ISLAND_WITHOUT_BARRIER"] = 3] = "NARROW_ISLAND_WITHOUT_BARRIER";
    DirectionDivider[DirectionDivider["DOUBLE_YELLOW_LINE_WITH_MARK"] = 4] = "DOUBLE_YELLOW_LINE_WITH_MARK";
    DirectionDivider[DirectionDivider["DOUBLE_YELLOW_LINE_WITHOUT_MARK"] = 5] = "DOUBLE_YELLOW_LINE_WITHOUT_MARK";
    DirectionDivider[DirectionDivider["SOLID_BROKEN_YELLOW_LINE_WITH_MARK"] = 6] = "SOLID_BROKEN_YELLOW_LINE_WITH_MARK";
    DirectionDivider[DirectionDivider["SOLID_BROKEN_YELLOW_LINE_WITHOUT_MARK"] = 7] = "SOLID_BROKEN_YELLOW_LINE_WITHOUT_MARK";
    DirectionDivider[DirectionDivider["BROKEN_YELLOW_LINE_WITH_MARK"] = 8] = "BROKEN_YELLOW_LINE_WITH_MARK";
    DirectionDivider[DirectionDivider["BROKEN_YELLOW_LINE_WITHOUT_MARK"] = 9] = "BROKEN_YELLOW_LINE_WITHOUT_MARK";
    DirectionDivider[DirectionDivider["NONE"] = 10] = "NONE";
})(DirectionDivider || (DirectionDivider = {}));
export var NormalLaneDivider;
(function (NormalLaneDivider) {
    NormalLaneDivider[NormalLaneDivider["DOUBLE_WHITE_LINE_WITH_MARK"] = 1] = "DOUBLE_WHITE_LINE_WITH_MARK";
    NormalLaneDivider[NormalLaneDivider["DOUBLE_WHITE_LINE_WITHOUT_MARK"] = 2] = "DOUBLE_WHITE_LINE_WITHOUT_MARK";
    NormalLaneDivider[NormalLaneDivider["BROKEN_WHITE_LINE_WITH_MARK"] = 3] = "BROKEN_WHITE_LINE_WITH_MARK";
    NormalLaneDivider[NormalLaneDivider["BROKEN_WHITE_LINE_WITHOUT_MARK"] = 4] = "BROKEN_WHITE_LINE_WITHOUT_MARK";
    NormalLaneDivider[NormalLaneDivider["NONE"] = 5] = "NONE";
})(NormalLaneDivider || (NormalLaneDivider = {}));
export var FastSlowLaneDivider;
(function (FastSlowLaneDivider) {
    FastSlowLaneDivider[FastSlowLaneDivider["WIDE_ISLAND"] = 1] = "WIDE_ISLAND";
    FastSlowLaneDivider[FastSlowLaneDivider["NARROW_ISLAND_WITH_BARRIER"] = 2] = "NARROW_ISLAND_WITH_BARRIER";
    FastSlowLaneDivider[FastSlowLaneDivider["NARROW_ISLAND_WITHOUT_BARRIER"] = 3] = "NARROW_ISLAND_WITHOUT_BARRIER";
    FastSlowLaneDivider[FastSlowLaneDivider["FAST_SLOW_LANE_LINE"] = 4] = "FAST_SLOW_LANE_LINE";
    FastSlowLaneDivider[FastSlowLaneDivider["NONE"] = 5] = "NONE";
})(FastSlowLaneDivider || (FastSlowLaneDivider = {}));
export var EdgeLine;
(function (EdgeLine) {
    EdgeLine[EdgeLine["HAVE"] = 1] = "HAVE";
    EdgeLine[EdgeLine["NONE"] = 2] = "NONE";
})(EdgeLine || (EdgeLine = {}));
export var CrashType;
(function (CrashType) {
    CrashType[CrashType["WALK_INVERSE_DIRECTION"] = 1] = "WALK_INVERSE_DIRECTION";
    CrashType[CrashType["WALK_SAME_DIRECTION"] = 2] = "WALK_SAME_DIRECTION";
    CrashType[CrashType["CROSSING_ROAD"] = 3] = "CROSSING_ROAD";
    CrashType[CrashType["PLAYING_ON_ROAD"] = 4] = "PLAYING_ON_ROAD";
    CrashType[CrashType["WORKING_ON_ROAD"] = 5] = "WORKING_ON_ROAD";
    CrashType[CrashType["RUNNING_INTO_ROAD"] = 6] = "RUNNING_INTO_ROAD";
    CrashType[CrashType["IMMERSING_BEHIND_CARS"] = 7] = "IMMERSING_BEHIND_CARS";
    CrashType[CrashType["STANDING_OUTSIDE_ROAD"] = 8] = "STANDING_OUTSIDE_ROAD";
    CrashType[CrashType["OTHER_HUMAN_AND_VEHICLE"] = 9] = "OTHER_HUMAN_AND_VEHICLE";
    CrashType[CrashType["HEAD_ON"] = 10] = "HEAD_ON";
    CrashType[CrashType["OPPOSITE_DIRECTION_SIDESWIPE"] = 11] = "OPPOSITE_DIRECTION_SIDESWIPE";
    CrashType[CrashType["SAME_DIRECTION_SIDESWIPE"] = 12] = "SAME_DIRECTION_SIDESWIPE";
    CrashType[CrashType["REAR_END"] = 13] = "REAR_END";
    CrashType[CrashType["IN_REVERSE"] = 14] = "IN_REVERSE";
    CrashType[CrashType["CROSS_TRAFFIC"] = 15] = "CROSS_TRAFFIC";
    CrashType[CrashType["SIDE_IMPACT"] = 16] = "SIDE_IMPACT";
    CrashType[CrashType["OTHER_VEHICLE_ANDCEHICLE"] = 17] = "OTHER_VEHICLE_ANDCEHICLE";
    CrashType[CrashType["ROLL_OVER_OR_SLIDE"] = 18] = "ROLL_OVER_OR_SLIDE";
    CrashType[CrashType["RUSH_OUT_OF_ROAD"] = 19] = "RUSH_OUT_OF_ROAD";
    CrashType[CrashType["BARRIER_IMPACT"] = 20] = "BARRIER_IMPACT";
    CrashType[CrashType["TRAFFIC_LIGHT_IMPACT"] = 21] = "TRAFFIC_LIGHT_IMPACT";
    CrashType[CrashType["TOLLGATE_IMPACT"] = 22] = "TOLLGATE_IMPACT";
    CrashType[CrashType["ISLAND_IMPACT"] = 23] = "ISLAND_IMPACT";
    CrashType[CrashType["UNFIXED_FACILITY_IMPACT"] = 24] = "UNFIXED_FACILITY_IMPACT";
    CrashType[CrashType["BRIDGE_BUILDING_IMPACT"] = 25] = "BRIDGE_BUILDING_IMPACT";
    CrashType[CrashType["TREE_UTILITY_POLE_IMPACT"] = 26] = "TREE_UTILITY_POLE_IMPACT";
    CrashType[CrashType["ANIMAL_IMPACT"] = 27] = "ANIMAL_IMPACT";
    CrashType[CrashType["CONSTRUCTION_FACILITY_IMPACT"] = 28] = "CONSTRUCTION_FACILITY_IMPACT";
    CrashType[CrashType["OTHER_SINGLE_VEHICLE"] = 29] = "OTHER_SINGLE_VEHICLE";
    CrashType[CrashType["LEVEL_CROSSING_BARRIER_IMPACT"] = 30] = "LEVEL_CROSSING_BARRIER_IMPACT";
    CrashType[CrashType["CROSSING_LEVEL_CROSSING"] = 31] = "CROSSING_LEVEL_CROSSING";
    CrashType[CrashType["STOP_WRONG_POSITION"] = 32] = "STOP_WRONG_POSITION";
    CrashType[CrashType["STUCK_IN_LEVEL_CROSSING"] = 33] = "STUCK_IN_LEVEL_CROSSING";
    CrashType[CrashType["OTEHR_LEVEL_CROSSING"] = 34] = "OTEHR_LEVEL_CROSSING";
})(CrashType || (CrashType = {}));
/**
 * Class for indicate an accident case
 */
export default class Case extends autoImplements() {
    // This is not a perfect method to distinguish different cases.
    // TODO: Find a perfect method to distinguish different cases.
    equalTo(other) {
        return (this.date.equals(other.date)
            && this.location === other.location
            && this.severity === other.severity);
    }
}
