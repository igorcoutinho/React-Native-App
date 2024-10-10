import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { Component, ErrorInfo } from "react";
import { Linking, View } from "react-native";
import { BaseButton } from "../components/BaseButton";
import { MainContainer } from "../components/MainContainer";
import { Heading, Paragraph } from "../components/Typography";
import { Section } from "../components/elements/Section";
import { useUser } from "../states/User";
import { IUser } from "../states/User/types";
import { Colors } from "../theme/colors";
import { CustomLogger } from "./CustomLogger";

// Reference: https://www.reactnative.university/blog/react-native-error-boundaries#feature-error-boundaries

const DefaultFallback = ({ onPressToReset }: { onPressToReset: () => void; }) => {
  return (
    <MainContainer paddingBottom={0}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            gap: 20,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              height: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FontAwesomeIcon
              color={Colors.attention}
              icon={faExclamationCircle}
              size={100}
            />
          </View>
          <Section>
            <Heading align="center" size="large">
              Something went wrong
            </Heading>
            <Paragraph align="center" size="large">
              But don't worry, we're on it!
            </Paragraph>
            <BaseButton onPress={onPressToReset}>
              Go Back Home
            </BaseButton>
          </Section>
        </View>
      </View>
    </MainContainer>
  );
};

interface IErrorBoundaryProps {
  children: React.ReactElement;
  fallback?: React.ReactElement;
  loggedUser?: IUser;
}

class ErrorBoundaryClass extends Component<
  IErrorBoundaryProps,
  {
    hasError: boolean;
  }
> {

  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    CustomLogger({
      componentStack: errorInfo.componentStack,
      error,
      loggedUser: this.props.loggedUser,
      message: error.message,
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <DefaultFallback
          onPressToReset={() => this.setState({
            hasError: false
          }, () => {
            Linking.openURL('whipapp://goto/myWhips');
          })}
        />
      );
    }
    return this.props.children;
  }
}

const ErrorBoundary = (props: IErrorBoundaryProps) => {
  const { user } = useUser();
  return (
    <ErrorBoundaryClass {...props} loggedUser={user} />
  )
};

export default ErrorBoundary;