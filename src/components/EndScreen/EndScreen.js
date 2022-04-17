import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useState, useEffect } from "react";
import { colors, colorsToEmoji } from "../../constants";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { SlideInLeft } from "react-native-reanimated";
import GuessDistribution from "./GuessDistribution";

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

const EndScreen = ({ won = false, rows, getCellBackgrouncColor }) => {
    const [secondTilTommorrow, setSecondTilTomorrow] = useState(0);
    const [played, setPlayed] = useState(0);
    const [winRate, setWinRate] = useState(0);
    const [curStreak, setCurrStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [distribution, setDistribution] = useState(null);
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
        let _currStreak = 0;
        let prevDay = 0;
        let maxStreak = 0;
        keys.forEach((key) => {
            // console.log("this");
            //cl console.log(key);
            const day = parseInt(key.split("-")[1]);

            if (data[key].gameState === "Won" && _currStreak === 0) {
                _currStreak += 1;
            } else if (data[key].gameState === "Won" && prevDay + 1 === day) {
                _currStreak += 1;
            } else {
                if (_currStreak > maxStreak) {
                    maxStreak = _currStreak;
                }
                _currStreak = data[key].gameState === "Won" ? 1 : 0;
            }
            prevDay = day;
        });
        setCurrStreak(_currStreak);
        setMaxStreak(maxStreak);
        const dist = [0, 0, 0, 0, 0, 0];

        values.map((game) => {
            if (game.gameState === "Won") {
                const tries = game.rows.filter((row) => row[0]).length;
                dist[tries] = dist[tries] + 1;
            }
        });
        setDistribution(dist);
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
            <Animated.Text
                entering={SlideInLeft.springify().mass(0.5)}
                style={styles.title}
            >
                {won ? "Congrats!" : "Meh ! Try Again Tomorrow"}
            </Animated.Text>
            <Text style={styles.subtitle}>Statistics</Text>
            <Animated.View entering={SlideInLeft.springify().mass(0.5)}>
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
            </Animated.View>
            <GuessDistribution distribution={distribution} />
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
