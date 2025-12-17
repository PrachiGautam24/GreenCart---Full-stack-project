import { useState } from "react";
import { useDispatch } from "react-redux";
import { authService } from "@/store/services/authService";
import { setCredentials } from "@/store/slices/authSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import ValidatedInput from "@/components/ui/validated-input";
import { validateEmail, validatePassword, validateUsername, validateCity, ValidationResult } from "@/utils/validation";

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

const RegisterDialog = ({ open, onOpenChange, onSwitchToLogin }: RegisterDialogProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "buyer" as "buyer" | "seller" | "admin",
    city: "",
  });
  const [validationResults, setValidationResults] = useState({
    username: { isValid: false, message: "" },
    email: { isValid: false, message: "" },
    password: { isValid: false, message: "" },
    city: { isValid: false, message: "" },
  });

  const handleValidation = (field: string, result: ValidationResult) => {
    setValidationResults(prev => ({
      ...prev,
      [field]: result
    }));
  };

  const isFormValid = Object.values(validationResults).every(result => result.isValid) &&
    Object.values(formData).every(value => value.trim().length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast({
        title: "Form validation failed",
        description: "Please fix all errors before submitting",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register(formData);
      dispatch(setCredentials(response.data));
      toast({
        title: "Account created!",
        description: "Welcome to GreenCart. Start shopping sustainably!",
      });
      onOpenChange(false);
      setFormData({ username: "", email: "", password: "", role: "buyer", city: "" });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.error?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Account</DialogTitle>
          <DialogDescription>
            Join GreenCart and start your sustainable shopping journey
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ValidatedInput
            id="username"
            label="Username"
            placeholder="johndoe"
            value={formData.username}
            onChange={(value) => setFormData({ ...formData, username: value })}
            onValidation={(result) => handleValidation('username', result)}
            validator={validateUsername}
            required
          />

          <ValidatedInput
            id="reg-email"
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            onValidation={(result) => handleValidation('email', result)}
            validator={validateEmail}
            required
          />

          <ValidatedInput
            id="reg-password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: value })}
            onValidation={(result) => handleValidation('password', result)}
            validator={validatePassword}
            required
          />

          <ValidatedInput
            id="city"
            label="City"
            placeholder="New York"
            value={formData.city}
            onChange={(value) => setFormData({ ...formData, city: value })}
            onValidation={(result) => handleValidation('city', result)}
            validator={validateCity}
            required
          />

          <div className="space-y-2">
            <Label htmlFor="role">I want to</Label>
            <Select
              value={formData.role}
              onValueChange={(value: "buyer" | "seller") => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Buy sustainable products</SelectItem>
                <SelectItem value="seller">Sell my eco-friendly products</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !isFormValid}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onSwitchToLogin();
              }}
              className="text-primary hover:underline"
            >
              Login
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog;
