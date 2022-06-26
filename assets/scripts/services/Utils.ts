export const randomItems = (array: any[], num: number) => {
    let newArray = [...array];
    let resultArray: any[] = [];
    for (let cnt = 0; cnt < num; cnt++) {
      const index = Math.floor(Math.random() * newArray.length);
      resultArray = [...resultArray, newArray[index]];
      newArray.splice(index, 1);
    }
    return resultArray.shift();
  };
  