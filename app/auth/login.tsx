import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import API from "../../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Validation ──────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address.";

    if (!password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ───────────────────────────────────────────────────
  const loginUser = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await API.post("/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

      router.replace("/pages/men/menDashboard" as any);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const serverErrors: Record<string, string> = {};
        Object.entries(err.response.data.errors).forEach(([key, val]) => {
          serverErrors[key] = (val as string[])[0];
        });
        setErrors(serverErrors);
      } else {
        setErrors({
          general: err.response?.data?.message || "Invalid email or password.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Helper: field error label ────────────────────────────────
  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? <Text style={styles.error}>⚠ {errors[field]}</Text> : null;

  return (
    <ImageBackground
      source={require("../../assets/images/boutique_background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Image
              source={require("../../assets/images/logo3.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>Account Login</Text>

            {/* General error (e.g. wrong credentials) */}
            {errors.general && (
              <View style={styles.errorBox}>
                <Text style={styles.error}>⚠ {errors.general}</Text>
              </View>
            )}

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="username@gmail.com"
              style={[styles.input, errors.email && styles.inputError]}
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                setErrors((e) => ({ ...e, email: "" }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <FieldError field="email" />

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.passwordContainer,
                errors.password && styles.inputError,
              ]}
            >
              <TextInput
                placeholder="Password"
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  setErrors((e) => ({ ...e, password: "" }));
                }}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eye}>{showPassword ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
            </View>
            <FieldError field="password" />

            <Text style={styles.forgot}>Forgot Password?</Text>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={loginUser}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign in</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.txt}>
              Don't have an account?{" "}
              <Text
                style={styles.link}
                onPress={() => router.push("/auth/register")}
              >
                Register here
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(194, 158, 114, 0.59)",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: 300,
    backgroundColor: "rgba(253, 250, 250, 0.32)",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
  },
  logo: { width: 190, height: 120, marginBottom: 10 },
  title: {
    fontSize: 22,
    marginVertical: 15,
    color: "#2b2b2b",
    fontWeight: "600",
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    color: "#3c3c3c",
    marginTop: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: "#fff",
  },
  inputError: { borderColor: "#e53e3e", borderWidth: 1.5 },
  passwordContainer: {
    width: "100%",
    position: "relative",
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  passwordInput: { padding: 10, paddingRight: 50 },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  eye: { color: "#555", fontWeight: "500" },
  forgot: {
    alignSelf: "flex-end",
    marginTop: 8,
    fontSize: 13,
    color: "#000000",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#3b2314",
    padding: 12,
    borderRadius: 5,
    width: "100%",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "500" },
  link: { color: "#0044ff" },
  txt: { marginTop: 15 },
  errorBox: { marginBottom: 5, width: "100%" },
  error: {
    color: "#e53e3e",
    fontSize: 12,
    marginTop: 3,
    alignSelf: "flex-start",
  },
});
