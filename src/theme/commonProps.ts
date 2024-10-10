export const cardStyleInterpolator = ({ current }: any) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

export const defaultScreenOptions: any = {
  cardStyleInterpolator,
  transitionSpec: {
    open: { animation: 'timing', config: { duration: 60 } },
    close: { animation: 'timing', config: { duration: 60 } },
  },
};

export const commonProps = {
  hitSlopBase: {
    bottom: 20,
    left: 20,
    right: 20,
    top: 20,
  },
};
