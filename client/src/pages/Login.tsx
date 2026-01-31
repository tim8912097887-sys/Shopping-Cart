import { Link, useNavigate } from "react-router-dom"
import { useForm, type SubmitHandler } from "react-hook-form"
import v from "validator"
import { login } from "@/api/auth"
import { useMutation } from "@tanstack/react-query"

type InputValue = {
  email: string
  password: string
}

const Login = () => {

  const navigation = useNavigate();
  const { mutate,isError,error,isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => {
       console.log("Success");
       navigation("/");
    }
  });
  const { 
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting
    },
   } = useForm<InputValue>();

   const handleLogin: SubmitHandler<InputValue> = async(data,e) => {
        e?.preventDefault();
        mutate(data);
   }
  return (
    // Center Container
    <div className="min-h-screen flex bg-slate-50 justify-center items-center p-4">
      {/* Form Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Login Account</h1>
          <p className="text-slate-500 mt-2">Login and start your journey today.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(handleLogin)}>
          {/* Input Group: Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-slate-700 ml-1">
              Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              placeholder="name@company.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 placeholder:text-slate-400"
              {...register("email",{
                required: "Email Requred",
                maxLength: {
                  value: 50,
                  message: "Email at most fifty character"
                },
                validate: {
                  validEmail: (email) => {
                    return v.isEmail(email) || "Invalid Email"
                  }
                }
              })}
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          {/* Input Group: Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-slate-700 ml-1">
              Password
            </label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 placeholder:text-slate-400"
              {...register("password",{
                required: "Password Required",
                minLength: {
                  value: 8,
                  message: "Password at least eight character"
                },
                maxLength: {
                  value: 50,
                  message: "Password at most fifty character"
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
                  message: "Password should include small and big letter and number and one special character"
                }
              })}
            />
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl mt-4 transition-colors duration-200 shadow-lg shadow-indigo-100 active:scale-[0.98]"
            disabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending?"Loading...":"Login Account"}
          </button>
        </form>
        {isError && <p className="text-red-500 text-sm">{error.message}</p>}
        {/* Footer Link */}
        <p className="text-center text-sm text-slate-600 mt-6">
          Do not have an account? <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login