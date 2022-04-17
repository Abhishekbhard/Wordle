import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../constants";
import GuessDistributionLine from "./GuessDistributionLine";

const GuessDistribution = ({ distribution }) => {
    //console.log(distribution.length);
    if (!distribution) {
        return null;
    }
    const sum = distribution.reduce((total, dist) => dist + total, 0);
    return (
        <>
            <Text style={styles.subtitle}>Guess Distribution</Text>

            <View style={{ width: "100%", padding: 5 }}>
                {distribution.map((dist, index) => {
                    return (
                        <GuessDistributionLine
                            key={index}
                            position={index + 1}
                            amount={dist}
                            percentage={(100 * dist) / sum}
                        />
                    );
                })}
            </View>
        </>
    );
};
const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        color: "white",
        marginVertical: 20,
        alignSelf: "center",
    },
    subtitle: {
        fontSize: 15,
        color: colors.lightgrey,
        textAlign: "center",
        marginVertical: 15,
        fontWeight: "bold",
    },
});
export default GuessDistribution;
