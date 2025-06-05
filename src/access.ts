 
export default (initialState: Record<string, any>) => {
  
  return { 
    canSeeAdmin: initialState.role == '0', 
    canSeeReader: initialState.role == '1',
  };
};
