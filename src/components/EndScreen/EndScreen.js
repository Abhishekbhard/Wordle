import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useState, useEffect } from "react";
import { colors, colorsToEmoji } from "../../constants";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Number = ({ number, label }) => {
    return (
        <View style={{ alignItems: "center", margin: 10 }}>
            <Text
                style={{
                    color: colors.lightgrey,
                    fontSize: 30,
                    fontWeight: "bold",
                }}
            >
                {number}
            </Text>
            <Text
                style={{
                    color: colors.lightgrey,
                    fontSize: 16,
                }}
            >
                {label}
            </Text>
        </View>
    );
};
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
                }}
            >
                <Text style={{ color: colors.lightgrey }}>{amount}</Text>
            </View>
        </View>
    );
};
const GuessDistribution = () => {
    return (
        <>
            <Text style={styles.subtitle}>Guess Distribution</Text>

            <View style={{ width: "100%", padding: 5 }}>
                <GuessDistributionLine
                    position={0}
                    amount={2}
                    percentage={54}
                />
            </View>
        </>
    );
};

const EndScreen = ({ won = false, rows, getCellBackgrouncColor }) => {
    const [secondTilTommorrow, setSecondTilTomorrow] = useState(0);
    const [played, setPlayed] = useState(0);
    const [winRate, setWinRate] = useState(0);
    const [curStreak, setCurrStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    //console.log(won);
    const share = () => {
        const textMap = rows
            .map((row, i) =>
                row
                    .map(
                        (cell, j) => colorsToEmoji[getCellBackgrouncColor(i, j)]
                    )
                    .join("")
            )
            .filter((row) => row)
            .join("\n");
        let textToShare = `Wordle \n ${textMap}`;
        Clipboard.setString(textToShare);
        Alert.alert("Copied Successfully", "Share your code on social media");
        // console.log(textShare);
    };
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const tomorrow = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1
            );
            setSecondTilTomorrow((tomorrow - now) / 1000);
        };
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        readState();
    }, []);
    const readState = async () => {
        const dataString = await AsyncStorage.getItem("@Game");
        let data;
        try {
            data = JSON.parse(dataString);
            //const day = data[dayKey];
            // console.log(data[dayKey]);
            // console.log(data);
            // setPlayed(data)
            //console.log(data);
            // console.log(Object.keys(data));
        } catch (error) {
            console.log("Could not parse the state", error);
        }
        const keys = Object.keys(data);
        const values = Object.values(data);
        //console.log(values);
        setPlayed(keys.length);
        const numberOfWins = values.filter(
            (game) => game.gameState === "Won"
        ).length;

        setWinRate(Math.floor((100 * numberOfWins) / keys.length));
        //console.log(keys);
        let currStreak = 0;
        keys.forEach((key) => {
            // console.log("this");
            if (data[key].gameState === "Won") {
                currStreak += 1;
            } else {
                currStreak = 0;
            }
        });
        setCurrStreak(currStreak);
        // console.log(data);
    };

    const formatSecond = () => {
        const hours = Math.floor(secondTilTommorrow / (60 * 60));
        const minutes = Math.floor((secondTilTommorrow % (60 * 60)) / 60);
        const seconds = Math.floor(secondTilTommorrow % 60);

        return `${hours}:${minutes}:${seconds}`;
    };
    return (
        <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={styles.title}>
                {won ? "Congrats!" : "Meh ! Try Again Tomorrow"}
            </Text>
            <Text style={styles.subtitle}>Statistics</Text>
            <View
                style={{
                    flexDirection: "row",
                    marginBottom: 20,
                }}
            >
                <Number number={played} label={"Played"} />
                <Number number={winRate} label={"Win %"} />
                <Number number={curStreak} label={"Curr Streak"} />
                <Number number={maxStreak} label={"Max Streak"} />
            </View>
            <GuessDistribution />
            <View style={{ flexDirection: "row", padding: 10 }}>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={{ color: colors.lightgrey }}>Next Wordle</Text>
                    <Text
                        style={{
                            color: colors.lightgrey,
                            fontSize: 24,
                            fontWeight: "bold",
                        }}
                    >
                        {formatSecond()}
                    </Text>
                </View>
                <Pressable
                    onPress={share}
                    style={{
                        flex: 1,
                        backgroundColor: colors.primary,
                        borderRadius: 25,
                        justifyContent: "center",

                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{ color: colors.lightgrey, fontWeight: "bold" }}
                    >
                        Share
                    </Text>
                </Pressable>
            </View>
        </View>
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

export default EndScreen;
