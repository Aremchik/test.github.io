import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FormContainer } from "../../../components/form/FormContainer";
import { MainApiService } from "../../../services/MainApiService";

export const Authorization: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    const apiService = new MainApiService();

    try {
      await apiService.login(username, password);
      console.log("Авторизация успешна");
      navigate("/");
    } catch (err) {
      setError("Ошибка авторизации. Попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer title="Авторизация">
      <TextField
        label="Имя пользователя"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <TextField
        label="Пароль"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        onClick={handleSubmit}
        sx={{ mt: 2 }}
      >
        {loading ? "Вход..." : "Войти"}
      </Button>
    </FormContainer>
  );
};
