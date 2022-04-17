import { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import Keyboard from "../Keyboard";
import words from "../../words";
import styles from "./Game.styles";
import { copyArray, getDayOfTheyear, getDayKey } from "../../utils";

import { colors, CLEAR, ENTER, colorsToEmoji } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EndScreen from "../EndScreen";
import Animated, {
    SlideInDown,
    SlideInLeft,
    ZoomIn,
    FlipInEasyY,
} from "react-native-reanimated";

const NUMBER_OF_TRIES = 6;

const dayOfTheYear = getDayOfTheyear();
const dayKey = getDayKey();

// const game={
//     day_15:{
//         rows:[[],[]],
//         curRow:2,
//         curCol:5,
//         gameState:'lost'
//     },
//     day_16:{
//         rows:[[],[]],
//         curRow:2,
//         curCol:5,
//         gameState:'lost'
//     },
//     day_17:{
//         rows:[[],[]],
//         curRow:2,
//         curCol:5,
//         gameState:'won'
//     }
// }

const Game = () => {
    // AsyncStorage.removeItem("@Game");
    //console.log(dayOfTheYear);
    const word = words[dayOfTheYear];
    console.log(dayOfTheYear);

    const letters = word.split(""); //['h','e','l','l','o']
    const [rows, setRows] = useState(
        new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
    );
    const [curRow, setCurrRow] = useState(0);
    const [curCol, setCurCol] = useState(0);
    const [gameState, setGameState] = useState("Playing");
    const [loaded, setLoaded] = useState(false);

    const onKeyPressed = (key) => {
        if (gameState != "Playing") {
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
    useEffect(() => {
        if (loaded) presistState();
    }, [rows, curRow, curCol, gameState]);
    const presistState = async () => {
        const dataforToday = {
            rows,
            curRow,
            curCol,
            gameState,
        };
        try {
            const existingStateString = await AsyncStorage.getItem("@Game");
            // console.log(existingStateString);
            const existingState = existingStateString
                ? JSON.parse(existingStateString)
                : {};

            existingState[dayKey] = dataforToday;
            //  console.log(existingState);

            const dataString = JSON.stringify(existingState);
            await AsyncStorage.setItem("@Game", dataString);
            //console.log("Saving", dataString);
        } catch (error) {
            console.log("Failed to save data in async storage", error);
        }
    };
    useEffect(() => {
        readState();
    }, []);
    const readState = async () => {
        const dataString = await AsyncStorage.getItem("@Game");
        try {
            const data = JSON.parse(dataString);
            const day = data[dayKey];
            //");
            // console.log(data[dayKey]);
            // console.log(data);
            setRows(day.rows);
            setCurCol(day.curCol);
            setCurrRow(day.curRow);
            setGameState(day.gameState);
        } catch (error) {
            console.log("Could not parse the state", error);
        }
        // console.log(data);

        setLoaded(true);
    };
    const checkGameState = () => {
        if (checkIfWon() && gameState != "Won") {
            setGameState("Won");
        } else if (checkIfLost() && gameState != "Lost") {
            setGameState("Lost");
        }
    };

    const checkIfWon = () => {
        const row = rows[curRow - 1];

        return row.every((letter, i) => letter === letters[i]);
    };
    const checkIfLost = () => {
        return !checkIfWon() && curRow === rows.length;
    };

    if (!loaded)
        return (
            <>
                <ActivityIndicator />
            </>
        );
    if (gameState !== "Playing") {
        console.log(gameState);
        return (
            <EndScreen
                won={gameState === "Won"}
                rows={rows}
                getCellBackgrouncColor={getCellBackgrouncColor}
            />
        );
    }
    const getCellStyle = (i, j) => [
        styles.cell,
        {
            borderColor: isCellActive(i, j)
                ? colors.lightgrey
                : colors.darkgrey,
            backgroundColor: getCellBackgrouncColor(i, j),
        },
    ];
    // console.log(greenCaps);
    //console.log(rows);
    return (
        <>
            <ScrollView style={styles.map}>
                {rows.map((row, i) => (
                    <Animated.View
                        entering={SlideInLeft.delay(i * 30)}
                        key={`row${i}`}
                        style={styles.row}
                    >
                        {row.map((letter, j) => (
                            <>
                                {i < curRow && (
                                    <Animated.View
                                        entering={FlipInEasyY.delay(j * 100)}
                                        key={`cell-color${i}-${j}`}
                                        style={getCellStyle(i, j)}
                                    >
                                        <Text style={styles.cellText}>
                                            {letter.toUpperCase()}
                                        </Text>
                                    </Animated.View>
                                )}
                                {i === curRow && !!letter && (
                                    <Animated.View
                                        entering={ZoomIn}
                                        key={`cell-active${i}-${j}`}
                                        style={getCellStyle(i, j)}
                                    >
                                        <Text style={styles.cellText}>
                                            {letter.toUpperCase()}
                                        </Text>
                                    </Animated.View>
                                )}
                                {!letter && (
                                    <View
                                        key={`col${i}-${j}`}
                                        style={getCellStyle(i, j)}
                                    >
                                        <Text style={styles.cellText}>
                                            {letter.toUpperCase()}
                                        </Text>
                                    </View>
                                )}
                            </>
                        ))}
                    </Animated.View>
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

export default Game;
