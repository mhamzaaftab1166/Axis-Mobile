import { useNavigation } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Divider, List, Text, useTheme } from "react-native-paper";
import ButtonSegmented from "../../components/common/ButtonSegmented";
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useGetAllFaq } from "../../hooks/useFaqQuery";

export default function FAQScreen() {
  const { colors, fonts } = useTheme();
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const  { faqData, isLoading: fetchingFaq } = useGetAllFaq();

  const categories = [  
    { value: "general", label: "General" },
    { value: "payments", label: "Payments" },
  ];

  const toggleQuestion = (category, index) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [category]: prev[category] === index ? null : index,
    }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CenteredAppbarHeader title="FAQ" onBack={() => navigation.goBack()} />
      <LoadingOverlay visible={fetchingFaq}/>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Segmented Buttons for categories */}
        <ButtonSegmented
          options={categories}
          selected={selectedCategory}
          onChange={setSelectedCategory}
          cardStyle={{ marginBottom: 16 }}
        />

        {faqData && faqData
          .filter((item) => item.category === selectedCategory) 
          .map((item, idx) => (
            <List.Accordion
              key={idx}
              title={item.question}
              titleStyle={{
                fontFamily: fonts.medium?.fontFamily,
                fontSize: 16,
                color: colors.text,
              }}
              style={{
                backgroundColor: colors.surface,
                marginVertical: 4,
                borderRadius: 12,
                elevation: 2,
              }}
              expanded={expandedQuestions[selectedCategory] === idx}
              onPress={() => toggleQuestion(selectedCategory, idx)}
            >
              <View style={{ padding: 12, backgroundColor: colors.background }}>
                <Text
                  style={{
                    fontFamily: fonts.regular?.fontFamily,
                    fontSize: 14,
                    color: colors.text,
                  }}
                >
                  {item.answer}
                </Text>
              </View>
            </List.Accordion>
          )
        )}

        <Divider
          style={{ marginVertical: 12, backgroundColor: colors.disabled }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
