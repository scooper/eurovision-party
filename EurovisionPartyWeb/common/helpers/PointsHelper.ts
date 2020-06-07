export class PointsHelper {
    public static stringArrToMap(points: string[]) {
        var map = new Object();
        points.forEach((value: string) => {
            var splitPoints = value.split("|");
            map[splitPoints[0]] = parseInt(splitPoints[1]);
        });
        return map;
    }

    public static stringArrToInverseMap(points: string[]) {
        var map = new Object();
        points.forEach((value: string) => {
            var splitPoints = value.split("|");
            map[splitPoints[1]] = splitPoints[0];
        });
        return map;
    }

    public static mapToArrString(points: Object) {
        var result = [];
        for (let [key, value] of Object.entries(points)) {
            result.push(key + "|" + value);
        }
        return result;
    }
}