import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Keyboard from "./src/components/Keyboard";

import { colors, CLEAR, ENTER } from "./src/constants";
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

const NUMBER_OF_TRIES = 6;

const copyArray = (arr) => {
    return [...arr.map((rows) => [...rows])];
};

export default function App() {
    const word = "hello";
    const letters = word.split(""); //['h','e','l','l','o']
    const [rows, setRows] = useState(
        new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
    );
    const [curRow, setCurrRow] = useState(0);
    const [curCol, setCurCol] = useState(0);

    const onKeyPressed = (key) => {
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
    const getCellBackgrouncColor = (letter, row, col) => {
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
    //console.log(rows);
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <Text style={styles.title}>WORDLE</Text>
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
                                            letter,
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

            <Keyboard onKeyPressed={onKeyPressed} />
        </SafeAreaView>
    );
}

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
