import { InputHTMLAttributes } from "react";
import Form from "./Form";
import Search from "./Search";

export type BaseProps = | InputHTMLAttributes<HTMLInputElement> & {
  error?     : string; 
  className? : string;
};

export const Input = {
  Form   : Form,
  Search : Search,
};