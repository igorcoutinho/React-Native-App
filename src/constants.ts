const apiURLLocal = (pathName: string) =>
  `http://localhost:5001/whipapp-f3728/europe-west2/${pathName}`;

const apiURLRemote = (pathName: string) =>
  ``;

export const setAPIUrl = (pathName: string) =>
  __DEV__ ? apiURLLocal(pathName) : apiURLRemote(pathName);

export const keys = {
  stripePublishableKey: __DEV__

};


export const profileImage = (userId: string) =>
  ``;

