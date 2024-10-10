//
//  IntentHandler.swift
//  WUIExt
//
//  Created by Christian Spilhere on 26/02/24.
//

import PassKit
import UIKit
import SwiftUI

@available(iOS 14.0, *)
class AuthorizationExtensionHandler: UIViewController, PKIssuerProvisioningExtensionAuthorizationProviding {
    var completionHandler: ((PKIssuerProvisioningExtensionAuthorizationResult) -> Void)?

    override func viewDidLoad() {
        super.viewDidLoad()
        setupAuthenticationView()
    }
    
    private func setupAuthenticationView() {
        let contentView = AuthenticationView(appGroupIdentifier: "group.org.whipapp") { result in
            // Handle the authorization result
            self.completionHandler?(result)
            self.dismiss(animated: true, completion: nil)
        }
        
        let hostingController = UIHostingController(rootView: contentView)
        hostingController.isModalInPresentation = true

        // Adjust hostingController's view frame or constraints as needed
        self.present(hostingController, animated: true, completion: nil)
    }
}

struct AuthenticationView: View {
    @State private var password: String = ""
    @State private var showAlert = false
    @State private var alertMessage = ""
    var appGroupIdentifier = "group.org.whipapp"
    var completion: ((PKIssuerProvisioningExtensionAuthorizationResult) -> Void)?
    
    var body: some View {
        VStack(spacing: 20) {
            // Image Placeholder - Replace "image_name" with your actual image name
            Image("whipAppLogo")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 100, height: 100)
            
            // Label above the input field
            Text("Enter your Whipapp password")
                .foregroundColor(.darkGray) // Dark grey color
            
            // SecureField with custom styling
            SecureField("Enter your password", text: $password)
                .padding()
                .background(Color.lightGray) // Light grey background for the input
                .cornerRadius(6) // Rounded corners for the input field
                .overlay(
                    RoundedRectangle(cornerRadius: 6)
                        .stroke(Color.darkGray, lineWidth: 1) // Darker rounded border
                )
                .padding(.horizontal)
            
            // Submit Button with custom styling
            Button("Submit") {
                validateUserPassword()
            }
            .padding()
            .foregroundColor(.white) // White text color
            .background(Color.orange) // Orange background
            .cornerRadius(6) // Rounded corners for the button
        }
        .padding()
        .background(Color.white) // White background for the entire view
        .onAppear {
            checkIdTokenExistence()
        }
        .alert(isPresented: $showAlert) {
            Alert(title: Text("Error"), message: Text(alertMessage), dismissButton: .default(Text("OK")))
        }
    }
    
    private func checkIdTokenExistence() {
        if let userDefaults = UserDefaults(suiteName: appGroupIdentifier),
           let _ = userDefaults.string(forKey: "idToken") {
        } else {
            showCannotProceedAlert()
        }
    }
    
    private func validateUserPassword() {
        if let userDefaults = UserDefaults(suiteName: appGroupIdentifier),
           let savedPassword = userDefaults.string(forKey: "userPassword"),
           savedPassword == password {
            completion?(.authorized)
        } else {
            showCannotProceedAlert()
        }
    }
    
    private func showCannotProceedAlert(message: String = "You cannot proceed.") {
        self.alertMessage = message
        self.showAlert = true
    }
}

extension Color {
    static let darkGray = Color(white: 0.4)
    static let lightGray = Color(white: 0.95)
}

struct AuthenticationView_Previews: PreviewProvider {
    static var previews: some View {
        AuthenticationView()
    }
}
