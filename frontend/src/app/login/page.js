"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  TextField, 
  Button, 
  Link, 
  Container, 
  Typography, 
  Box, 
  Paper,
  InputAdornment,
  Avatar,
  IconButton
} from "@mui/material";
import { 
  Email as EmailIcon, 
  Lock as LockIcon, 
  Visibility as VisibilityIcon, 
  VisibilityOff as VisibilityOffIcon,
  SportsSoccer as SoccerIcon,
  SportsTennis as TennisIcon,
  SportsBasketball as BasketballIcon,
  SportsVolleyball as VolleyballIcon
} from "@mui/icons-material";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur de connexion");
      }

      // Stocker le token dans localStorage ou cookie (à sécuriser plus tard)
      localStorage.setItem("token", data.token);

      // Rediriger vers la page principale après connexion
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          mt: 8, 
          mb: 8, 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center" 
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            padding: 4, 
            width: "100%", 
            borderRadius: 2,
            background: 'linear-gradient(to bottom, #ffffff, #f5f8fa)'
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Avatar 
              sx={{ 
                backgroundColor: "#1976d2", 
                width: 70, 
                height: 70,
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}
            >
              <SoccerIcon sx={{ fontSize: 40 }} />
            </Avatar>
          </Box>

          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: "bold", 
              color: "#1976d2",
              mb: 3
            }}
          >
            MatchBook
          </Typography>

          <Typography 
            variant="h5" 
            align="center" 
            gutterBottom 
            sx={{ 
              fontWeight: "medium", 
              color: "#333",
              mb: 4
            }}
          >
            Connexion
          </Typography>

          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ width: "100%" }}
          >
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Mot de passe"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            
            {error && (
              <Typography 
                color="error" 
                sx={{ 
                  mt: 1, 
                  mb: 2, 
                  textAlign: "center",
                  backgroundColor: "rgba(211, 47, 47, 0.1)",
                  padding: 1,
                  borderRadius: 1
                }}
              >
                {error}
              </Typography>
            )}
            
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              sx={{ 
                mt: 2, 
                mb: 2, 
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: 2,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)'
              }}
            >
              Se connecter
            </Button>
            
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Link 
                href="/register" 
                variant="body2"
                sx={{ 
                  color: "#1976d2", 
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline"
                  }
                }}
              >
                Créer un compte
              </Link>
              <Link 
                href="/reset-password" 
                variant="body2"
                sx={{ 
                  color: "#1976d2", 
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline"
                  }
                }}
              >
                Mot de passe oublié ?
              </Link>
            </Box>
          </Box>

          <Box sx={{ 
            display: "flex", 
            justifyContent: "center", 
            mt: 5, 
            gap: 2,
            color: "#9e9e9e"
          }}>
            <SoccerIcon />
            <BasketballIcon />
            <TennisIcon />
            <VolleyballIcon />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}