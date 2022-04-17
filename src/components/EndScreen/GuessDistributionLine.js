import React from "react";
import { View, Text } from "react-native";
import { colors } from "../../constants";

const GuessDistributionLine = ({ position, amount, percentage }) => {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <Text style={{ color: colors.lightgrey }}>{position}</Text>
            <View
                style={{
                    backgroundColor: colors.grey,
                    margin: 5,
                    padding: 5,
                    width: `${percentage}%`,
                    minWidth: 20,
                }}
            >
                <Text style={{ color: colors.lightgrey }}>{amount}</Text>
            </View>
        </View>
    );
};
export default GuessDistributionLine;
