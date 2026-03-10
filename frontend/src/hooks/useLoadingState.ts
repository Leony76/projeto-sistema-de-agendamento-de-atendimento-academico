import { useState } from "react"

export const useLoadingState = () => {

  const [loading, setLoading] = useState<boolean>(false);

  return {
    loading,
    setLoading,
  }
}