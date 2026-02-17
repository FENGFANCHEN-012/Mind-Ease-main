import { View, Text, Pressable } from "react-native";
import { useAppDispatch, useAppSelector } from "../../src/store/hooks";
import { addGoal, toggleGoal,setMood } from "../../src/store/mindslice";


export default function Plan() {
  const dispatch = useAppDispatch();
  const goals = useAppSelector(state => state.mind.goals);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Plan</Text>

      <Pressable onPress={() => dispatch(addGoal("Finish MindEase UI"))}>
        <Text>Add Goal</Text>
      </Pressable>

      {goals.map(g => (
        <Pressable key={g.id} onPress={() => dispatch(toggleGoal(g.id))}>
          <Text>
            {g.done ? "✅" : "⬜"} {g.title}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
