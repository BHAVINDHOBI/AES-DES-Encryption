import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Typography,
  Container,
  Box,
  IconButton,
  Tooltip,
  CssBaseline,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Define the dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212", // Dark background
      paper: "#1e1e1e", // Darker paper background
    },
    text: {
      primary: "#ffffff", // White text color
      secondary: "#b0b0b0", // Lighter gray for secondary text
    },
    primary: {
      main: "#bb86fc", // Purple accent color
    },
    secondary: {
      main: "#03dac6", // Teal accent color
    },
    warning: {
      main: "#ffb74d", // Orange warning
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif", // Change font if needed
    h4: {
      fontWeight: 600, // Semi-bold titles
    },
    body1: {
      fontWeight: 400, // Normal body text
    },
  },
});

function App() {
  const [algorithm, setAlgorithm] = useState("AES");
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [iv, setIv] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");
  const [generatedIv, setGeneratedIv] = useState("");
  const [mode, setMode] = useState("encrypt");
  const [autoKey, setAutoKey] = useState(false);
  const [plainText, setPlainText] = useState(""); // Store decrypted plain text

  useEffect(() => {
    if (mode === "decrypt" && encryptedText && generatedKey && generatedIv) {
      setText(encryptedText); // Auto-fill the encrypted text
      setKey(generatedKey); // Auto-fill the decryption key
      setIv(generatedIv); // Auto-fill the IV
      handleEncryptDecrypt(); // Automatically trigger decryption
    }
  }, [mode]);

  const handleEncryptDecrypt = async () => {
    const url =
      mode === "encrypt"
        ? "http://localhost:3000/encrypt"
        : "http://localhost:3000/decrypt";

    const payload = {
      text: mode === "encrypt" ? text : undefined,
      encryptedText: mode === "decrypt" ? text : undefined,
      algorithm,
      key: mode === "decrypt" ? key : autoKey || key === "" ? undefined : key,
      iv: mode === "decrypt" ? iv : undefined,
    };

    try {
      const response = await axios.post(url, payload);
      if (mode === "encrypt") {
        setEncryptedText(response.data.encryptedText);
        setGeneratedKey(response.data.key);
        setGeneratedIv(response.data.iv);
        setPlainText(""); // Clear the plain text when encrypting
      } else {
        setPlainText(response.data.decryptedText); // Store decrypted plain text
      }
    } catch (error) {
      console.error("Error during encryption/decryption", error);
    }
  };

  const copyToClipboard = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert("Copied to clipboard");
    });
  };

  const clearFields = () => {
    setText("");
    setKey("");
    setIv("");
    setEncryptedText("");
    setGeneratedKey("");
    setGeneratedIv("");
    setPlainText("");
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Ensures the dark theme applies to the entire app */}
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 5,
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            border: 2,
            borderColor: "white",
          }}
        >
          <Typography variant="h4" gutterBottom>
            {mode === "encrypt" ? "Encrypt" : "Decrypt"} Text
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Algorithm</InputLabel>
            <Select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              label="Select Algorithm"
            >
              <MenuItem value="AES">AES</MenuItem>
              <MenuItem value="DES">DES</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label={
              mode === "encrypt" ? "Enter plain text" : "Enter encrypted text"
            }
            variant="outlined"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Enter encryption key"
            variant="outlined"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            disabled={autoKey || mode === "decrypt"}
          />
          {mode === "encrypt" && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={autoKey}
                  onChange={() => setAutoKey(!autoKey)}
                />
              }
              label="Auto-generate Key"
            />
          )}
          {mode === "decrypt" && (
            <TextField
              fullWidth
              margin="normal"
              label="Enter IV (for decryption)"
              variant="outlined"
              value={iv}
              onChange={(e) => setIv(e.target.value)}
            />
          )}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEncryptDecrypt}
            >
              {mode === "encrypt" ? "Encrypt" : "Decrypt"}
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={() =>
                setMode(mode === "encrypt" ? "decrypt" : "encrypt")
              }
            >
              Switch to {mode === "encrypt" ? "Decrypt" : "Encrypt"} Mode
            </Button>

            <Button variant="outlined" color="warning" onClick={clearFields}>
              Clear Fields
            </Button>
          </Box>
          {mode === "encrypt" && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Encrypted Text:
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#333", // Use darker color for contrast
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
                  {encryptedText}
                </Typography>
                <Tooltip title="Copy">
                  <IconButton onClick={() => copyToClipboard(encryptedText)}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Generated Key:
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#333",
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
                  {generatedKey}
                </Typography>
                <Tooltip title="Copy">
                  <IconButton onClick={() => copyToClipboard(generatedKey)}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Generated IV:
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#333",
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
                  {generatedIv}
                </Typography>
                <Tooltip title="Copy">
                  <IconButton onClick={() => copyToClipboard(generatedIv)}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}
          {mode === "decrypt" && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Plain Text (Decrypted):
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#333",
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
                  {plainText}
                </Typography>
                <Tooltip title="Copy">
                  <IconButton onClick={() => copyToClipboard(plainText)}>
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
