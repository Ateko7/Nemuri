import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";

const tabs = ["Inicio", "Timeline", "Plan", "Chat"] as const;

export default function App() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Inicio");

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>Nemuri mobile</Text>
        <Text style={styles.title}>Un MVP calmado para padres con poco tiempo</Text>
        <View style={styles.tabRow}>
          {tabs.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.tab, item === tab && styles.tabActive]}
              onPress={() => setTab(item)}
            >
              <Text style={[styles.tabLabel, item === tab && styles.tabLabelActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === "Inicio" && (
          <>
            <Card eyebrow="Proxima siesta" title="09:00" body="Ventana sugerida 2h15. Empieza a bajar estimulos desde 08:45." />
            <Card eyebrow="Registro rapido" title="Dos taps" body="Iniciar siesta, terminar siesta, despertar nocturno o dormir noche." />
            <Card eyebrow="Estado del dia" title="Riesgo moderado" body="Hubo mala noche. Conviene proteger la primera y segunda siesta." />
          </>
        )}

        {tab === "Timeline" && (
          <Card
            eyebrow="Hoy"
            title="Timeline del dia"
            body="06:45 despertar, 09:10 siesta 1, 12:35 siesta 2, 16:05 siesta 3, 19:42 dormir noche."
          />
        )}

        {tab === "Plan" && (
          <>
            <Card eyebrow="Objetivo" title="Menos sobrecansancio" body="Adelantar siesta 2 si la primera dura menos de 40 minutos." />
            <Card eyebrow="Rutina" title="Secuencia corta" body="Cortina, brazos, frase repetida, apoyo consistente y cuna." />
          </>
        )}

        {tab === "Chat" && (
          <View style={styles.card}>
            <Text style={styles.cardEyebrow}>Acompanamiento</Text>
            <Text style={styles.cardTitle}>Chat con asesora</Text>
            <View style={styles.bubbleAdvisor}>
              <Text style={styles.bubbleText}>Hoy cuidemos mucho la primera ventana para bajar la carga del dia.</Text>
            </View>
            <View style={styles.bubbleParent}>
              <Text style={styles.bubbleText}>Anoche tuvimos 4 despertares y la noto muy sensible.</Text>
            </View>
            <View style={styles.composer}>
              <TextInput placeholder="Escribe una actualizacion..." placeholderTextColor="#78867f" style={styles.input} />
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function Card({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardEyebrow}>{eyebrow}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f6f1e8"
  },
  container: {
    padding: 20,
    paddingTop: 64,
    gap: 16
  },
  eyebrow: {
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#6d7e76",
    fontSize: 12
  },
  title: {
    fontSize: 32,
    lineHeight: 34,
    color: "#274038",
    fontWeight: "700",
    marginBottom: 8
  },
  tabRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8
  },
  tab: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fffaf3"
  },
  tabActive: {
    backgroundColor: "#496557"
  },
  tabLabel: {
    color: "#274038"
  },
  tabLabelActive: {
    color: "#fffaf3"
  },
  card: {
    backgroundColor: "rgba(255,252,247,0.95)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(39,64,56,0.08)"
  },
  cardEyebrow: {
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#6d7e76",
    fontSize: 11,
    marginBottom: 8
  },
  cardTitle: {
    fontSize: 24,
    lineHeight: 28,
    color: "#274038",
    fontWeight: "700",
    marginBottom: 8
  },
  cardBody: {
    color: "#62746c",
    lineHeight: 22
  },
  bubbleAdvisor: {
    backgroundColor: "rgba(123,154,126,0.18)",
    borderRadius: 18,
    padding: 14,
    marginTop: 12
  },
  bubbleParent: {
    backgroundColor: "rgba(220,199,175,0.24)",
    borderRadius: 18,
    padding: 14,
    marginTop: 12,
    alignSelf: "flex-end"
  },
  bubbleText: {
    color: "#274038",
    lineHeight: 20
  },
  composer: {
    gap: 10,
    marginTop: 14
  },
  input: {
    backgroundColor: "#fffaf3",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#274038"
  },
  primaryButton: {
    backgroundColor: "#496557",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center"
  },
  primaryButtonText: {
    color: "#fffaf3",
    fontWeight: "600"
  }
});
