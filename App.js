import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Keyboard from "./src/components/Keyboard";

import { colors } from "./src/constants";

const NUMBER_OF_TRIES = 6;

export default function App() {
    const word = "hello";
    const letters = word.split(""); //['h','e','l','l','o']
    const rows = new Array(NUMBER_OF_TRIES).fill(
        new Array(letters.length).fill("a")
    );

    const onKeyPressed = (key) => {
        console.warn(key);
    };
    //console.log(rows);
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <Text style={styles.title}>WORDLE</Text>
            <ScrollView style={styles.map}>
                {rows.map((row) => (
                    <View style={styles.row}>
                        {row.map((cell) => (
                            <View style={styles.cell}>
                                <Text style={styles.cellText}>
                                    {cell.toUpperCase()}
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