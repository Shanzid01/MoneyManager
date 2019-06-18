let allColors=["#FFCDD2", "#E57373", "#F44336", "#D32F2F", "#B71C1C", "#FF8A80", "#FF1744", "#D50000", "#F8BBD0", "#F06292", "#E91E63", "#C2185B", "#880E4F", "#FF80AB", "#F50057", "#C51162", "#E1BEE7", "#BA68C8", "#9C27B0", "#7B1FA2", "#4A148C", "#EA80FC", "#D500F9", "#AA00FF", "#D1C4E9", "#9575CD", "#673AB7", "#512DA8", "#311B92", "#B388FF", "#651FFF", "#6200EA", "#C5CAE9", "#7986CB", "#3F51B5", "#303F9F", "#1A237E", "#8C9EFF", "#3D5AFE", "#304FFE", "#BBDEFB", "#64B5F6", "#2196F3", "#1976D2", "#0D47A1", "#82B1FF", "#2979FF", "#2962FF", "#B3E5FC", "#4FC3F7", "#03A9F4", "#0288D1", "#01579B", "#80D8FF", "#00B0FF", "#0091EA", "#B2EBF2", "#4DD0E1", "#00BCD4", "#0097A7", "#006064", "#84FFFF", "#00E5FF", "#00B8D4", "#B2DFDB", "#4DB6AC", "#009688", "#00796B", "#004D40", "#A7FFEB", "#1DE9B6", "#00BFA5", "#C8E6C9", "#81C784", "#4CAF50", "#388E3C", "#1B5E20", "#B9F6CA", "#00E676", "#00C853", "#DCEDC8", "#AED581", "#8BC34A", "#689F38", "#33691E", "#CCFF90", "#76FF03", "#64DD17", "#F0F4C3", "#DCE775", "#CDDC39", "#AFB42B", "#827717", "#F4FF81", "#C6FF00", "#AEEA00", "#FFF9C4", "#FFF176", "#FFEB3B", "#FBC02D", "#F57F17", "#FFFF8D", "#FFEA00", "#FFD600", "#FFECB3", "#FFD54F", "#FFC107", "#FFA000", "#FF6F00", "#FFE57F", "#FFC400", "#FFAB00", "#FFE0B2", "#FFB74D", "#FF9800", "#F57C00", "#E65100", "#FFD180", "#FF9100", "#FF6D00", "#FFCCBC", "#FF8A65", "#FF5722", "#E64A19", "#BF360C", "#FF9E80", "#FF3D00", "#DD2C00", "#D7CCC8", "#A1887F", "#795548", "#5D4037", "#3E2723", "#F5F5F5", "#E0E0E0", "#9E9E9E", "#616161", "#212121", "#CFD8DC", "#90A4AE", "#607D8B", "#455A64", "#263238"];

export default{
    getRandomColor(){
        return(allColors[getRandomInt(0,allColors.length-1)])
    }
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}