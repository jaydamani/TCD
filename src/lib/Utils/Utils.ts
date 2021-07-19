const arrIncludes = <T extends any>(arr : T[] | undefined,m : T) =>
!arr?.length || arr.includes(m)

const arrSome = <T extends any>
(arr : T[] | undefined,f : (a : T,i : number) => boolean) =>
!arr?.length || arr.some(f)

export { arrIncludes, arrSome }
