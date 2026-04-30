import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigation = useNavigation<any>();

  const registerUser = async () => {
    setLoading(true);
    setErrors([]);

    try {
      await axios.post("http://192.168.137.1:8000/api/register", {
        name,
        email,
        password,
        password_confirmation,
      });

      router.replace("/MenDashboard");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const apiErrors = Object.values(err.response.data.errors).flat();
        setErrors(apiErrors.map((e) => String(e)));
      } else {
        setErrors([err.response?.data?.message || "Registration failed"]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/boutique_background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        <View style={styles.card}>
          <Image
            source={require("../assets/images/logo3.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Create Account</Text>

          {errors.length > 0 && (
            <View style={styles.errorBox}>
              {errors.map((e, i) => (
                <Text key={i} style={styles.error}>
                  {e}
                </Text>
              ))}
            </View>
          )}

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            placeholder="John Doe"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="username@gmail.com"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eye}>{showPassword ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              style={styles.passwordInput}
              value={password_confirmation}
              onChangeText={setPasswordConfirmation}
            />

            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text style={styles.eye}>
                {showConfirmPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={registerUser}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign up</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.txt}>
            Already have an account?{" "}
            <Text style={styles.link} onPress={() => router.push("/login")}>
              Sign in
            </Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(194, 158, 114, 0.59)",
  },

  container: {
    flex: 1,
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

  logo: {
    width: 190,
    height: 120,
  },

  title: {
    fontSize: 22,
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

  passwordContainer: {
    width: "100%",
    position: "relative",
    marginTop: 5,
  },

  passwordInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    paddingRight: 50,
    borderRadius: 5,
    backgroundColor: "#fff",
  },

  eyeIcon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -10 }],
  },

  eye: {
    color: "#555",
    fontWeight: "500",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#3b2314",
    padding: 12,
    borderRadius: 5,
    width: "100%",
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },

  link: {
    color: "#0044ff",
  },

  txt: {
    marginTop: 15,
  },

  errorBox: {
    marginBottom: 10,
    width: "100%",
  },

  error: {
    color: "red",
  },
});
