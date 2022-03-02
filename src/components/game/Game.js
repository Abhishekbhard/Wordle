import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    View,
    Platform,
    ScrollView,
    Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { SafeAreaView } from "react-native-safe-area-context";
import Keyboard from "./src/components/Keyboard";

import { colors, CLEAR, ENTER, colorsToEmoji } from "./src/constants";

const NUMBER_OF_TRIES = 6;

const copyArray = (arr) => {
    return [...arr.map((rows) => [...rows])];
};
const getDayOfTheyear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    console.log(day);
    return day;
};
const dayOfTheYear = getDayOfTheyear();

const words = [
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
    "hello",
    "world",
];
const Game = () => {
    const word = words[dayOfTheYear];
    const letters = word.split(""); //['h','e','l','l','o']
    const [rows, setRows] = useState(
        new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
    );
    const [curRow, setCurrRow] = useState(0);
    const [curCol, setCurCol] = useState(0);
    const [gameState, setGameState] = useState("Playing");

    const onKeyPressed = (key) => {
        if (gameState == !"Playing") {
            return;
        }
        const updatedRows = copyArray(rows);
        //console.warn(updatedRows);
        if (key === CLEAR) {
            let prevCol = curCol - 1;
            if (prevCol >= 0) {
                updatedRows[curRow][prevCol] = "";
                setRows(updatedRows);
                setCurCol(prevCol);
            }

            return;
        }
        if (key === ENTER) {
            //console.log(rows[0].length);
            if (curCol === rows[0].length) {
                setCurrRow(curRow + 1);
                setCurCol(0);
            }
            return;
        }
        if (curCol < rows[0].length) {
            updatedRows[curRow][curCol] = key;
            setCurCol(curCol + 1);
            setRows(updatedRows);
        }

        //setRow([[]]);
    };
    const isCellActive = (row, col) => {
        return row === curRow && col === curCol;
    };
    const getCellBackgrouncColor = (row, col) => {
        let letter = rows[row][col];
        if (row >= curRow) {
            return colors.black;
        }
        if (letter === letters[col]) {
            return colors.primary;
        }
        if (letters.includes(letter)) {
            return colors.secondary;
        }
        return colors.darkgrey;
    };
    const getAllLettersWithColors = (color) => {
        return rows.flatMap((row, i) =>
            row.filter((cell, j) => getCellBackgrouncColor(i, j) === color)
        );
    };
    const greenCaps = getAllLettersWithColors(colors.primary);
    const yellowCaps = getAllLettersWithColors(colors.secondary);
    const blackCaps = getAllLettersWithColors(colors.darkgrey);
    useEffect(() => {
        if (curRow > 0) {
            checkGameState();
        }
    }, [curRow]);

    const checkGameState = () => {
        // console.log("check Game State Got called");
        if (checkIfWon() && gameState == !"Won") {
            Alert.alert("Hurraaay", "You Won", [
                { text: "Share", onPress: shareScore },
            ]);
            setGameState("Won");
        } else if (checkIfLost() && gameState != "Lost") {
            Alert.alert("Meh", "Try again tomorrow!");
            setGameState("Lost");
        }
    };
    const shareScore = () => {
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
    const checkIfWon = () => {
        const row = rows[curRow - 1];

        return row.every((letter, i) => letter === letters[i]);
    };
    const checkIfLost = () => {
        return !checkIfWon() && curRow === rows.length;
    };

    // console.log(greenCaps);
    //console.log(rows);
    return (
        <>
            {" "}
            <ScrollView style={styles.map}>
                {rows.map((row, i) => (
                    <View key={`row${i}`} style={styles.row}>
                        {row.map((letter, j) => (
                            <View
                                key={`col${j}`}
                                style={[
                                    styles.cell,
                                    {
                                        borderColor: isCellActive(i, j)
                                            ? colors.lightgrey
                                            : colors.darkgrey,
                                        backgroundColor: getCellBackgrouncColor(
                                            i,
                                            j
                                        ),
                                    },
                                ]}
                            >
                                <Text style={styles.cellText}>
                                    {letter.toUpperCase()}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>
            <Keyboard
                onKeyPressed={onKeyPressed}
                greenCaps={greenCaps}
                yellowCaps={yellowCaps}
                greyCaps={blackCaps}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
        alignItems: "center",
    },
    title: {
        color: colors.lightgrey,
        fontSize: 32,
        fontWeight: "bold",
        letterSpacing: 7,
    },
    map: {
        alignSelf: "stretch",
        height: 100,
    },
    row: {
        flexDirection: "row",
        alignSelf: "stretch",
        justifyContent: "center",
    },
    cell: {
        flex: 1,
        height: 30,
        borderWidth: 1,
        borderColor: colors.grey,
        aspectRatio: 1,
        margin: 3,
        maxWidth: 70,
        justifyContent: "center",
        alignItems: "center",
    },
    cellText: {
        color: colors.lightgrey,
        fontWeight: "bold",
        fontSize: 28,
    },
});
export default Game;