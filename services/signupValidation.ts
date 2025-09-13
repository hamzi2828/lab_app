export interface SignupFormData {
  title: string;
  firstname: string;
  lastname: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

export interface ValidationErrors {
  title?: boolean;
  firstname?: boolean;
  lastname?: boolean;
  gender?: boolean;
  dateOfBirth?: boolean;
  email?: boolean;
  phoneNumber?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
  acceptedTerms?: boolean;
}

export const validatePersonalSection = (data: Partial<SignupFormData>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.title || data.title.trim() === '') {
    errors.title = true;
  }

  if (!data.firstname || data.firstname.trim() === '') {
    errors.firstname = true;
  }

  if (!data.lastname || data.lastname.trim() === '') {
    errors.lastname = true;
  }

  if (!data.gender || data.gender.trim() === '') {
    errors.gender = true;
  }

  if (!data.dateOfBirth || data.dateOfBirth.trim() === '') {
    errors.dateOfBirth = true;
  }

  return errors;
};

export const validateContactSection = (data: Partial<SignupFormData>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.email || data.email.trim() === '') {
    errors.email = true;
  } else if (!isValidEmail(data.email)) {
    errors.email = true;
  }

  if (!data.phoneNumber || data.phoneNumber.trim() === '') {
    errors.phoneNumber = true;
  } else if (!isValidPhoneNumber(data.phoneNumber)) {
    errors.phoneNumber = true;
  }

  if (!data.password || data.password.trim() === '') {
    errors.password = true;
  } else if (data.password.length < 8) {
    errors.password = true;
  }

  // Make confirmPassword validation optional since it's not in the Postman request
  if (data.confirmPassword !== undefined) {
    if (data.confirmPassword.trim() === '') {
      errors.confirmPassword = true;
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = true;
    }
  }

  if (!data.acceptedTerms) {
    errors.acceptedTerms = true;
  }

  return errors;
};

export const validateAllFields = (data: Partial<SignupFormData>): ValidationErrors => {
  return {
    ...validatePersonalSection(data),
    ...validateContactSection(data)
  };
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhoneNumber = (phone: string): boolean => {
  // Accept both Pakistani format (03xxxxxxxxx) and international formats
  const phoneRegex = /^(03\d{9}|\d{10,12})$/;
  return phoneRegex.test(phone);
};

export const submitSignupForm = async (data: SignupFormData): Promise<any> => {
  try {
    // We'll skip full validation to match Postman behavior
    // Only validate critical fields to ensure the API call will work
    if (!data.email || !isValidEmail(data.email)) {
      throw new Error('Valid email is required');
    }
    
    if (!data.password) {
      throw new Error('Password is required');
    }
    
    // Format the data to match the successful Postman request format
    const apiData = {
      "title": data.title,
      "firstname": data.firstname,
      "lastname": data.lastname,
      "email": data.email,
      "password": data.password,
      "phoneNumber": data.phoneNumber,
      "gender": data.gender,
      "dateOfBirth": data.dateOfBirth,
      "acceptedTerms": data.acceptedTerms
    };
    
    console.log('Sending data to API:', apiData);
    
    try {
      const response = await fetch('https://hmis.rapidreporting.us/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      // Check if the response is valid JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('API returned non-JSON response:', await response.text());
        throw new Error('API returned invalid response format');
      }

      const result = await response.json();
      console.log('API response:', result);

      // Check for different error conditions
      if (!response.ok) {
        console.error('HTTP error:', response.status, response.statusText);
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }
      
      if (result.hasOwnProperty('success') && !result.success) {
        console.error('API reported failure:', result.message || 'Unknown error');
        throw new Error(result.message || 'Signup failed');
      }

      return result;
    } catch (fetchError) {
      if (fetchError instanceof TypeError && fetchError.message.includes('Failed to fetch')) {
        console.error('Network error - API server might be down or URL incorrect');
        throw new Error('Cannot connect to the server. Please check your internet connection or try again later.');
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};