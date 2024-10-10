//
//  IntentHandler.swift
//  WNonUIExt
//
//  Created by Christian Spilhere on 26/02/24.
//

import PassKit
import Foundation

@available(iOS 14.0, *)
class ExtensionHandler: PKIssuerProvisioningExtensionHandler {
    private let passLibrary = PKPassLibrary()
    var appGroupIdentifier = "group.org.whipapp"
    var userDefaults = UserDefaults(suiteName: "group.org.whipapp")

    override func status() async -> PKIssuerProvisioningExtensionStatus {
        let status = PKIssuerProvisioningExtensionStatus()
        if let _ = userDefaults?.string(forKey: "customerId") {
            status.requiresAuthentication = true
            status.passEntriesAvailable = true
            status.remotePassEntriesAvailable = true
        } else {
            status.requiresAuthentication = false
            status.passEntriesAvailable = false
            status.remotePassEntriesAvailable = false
        }
        return status
    }

    override func passEntries() async -> [PKIssuerProvisioningExtensionPassEntry] {
        let paymentPasses = passLibrary.passes().compactMap { $0.secureElementPass }
        return await getPassEntries(passes: paymentPasses)
    }

    override func remotePassEntries() async -> [PKIssuerProvisioningExtensionPassEntry] {
        let paymentPasses = passLibrary.remoteSecureElementPasses
        return await getPassEntries(passes: paymentPasses)
    }

    override func generateAddPaymentPassRequestForPassEntryWithIdentifier(
        _ identifier: String,
        configuration: PKAddPaymentPassRequestConfiguration,
        certificateChain certificates: [Data],
        nonce: Data,
        nonceSignature: Data
    ) async -> PKAddPaymentPassRequest? {
        guard let url = URL(string: "https://addcardtoapplewallet-qsezx5zk6a-nw.a.run.app") else {
            print("Invalid URL")
            return nil
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"

        let nonceHex = hexadecimalStringFromData(nonce)
        let nonceSignatureHex = hexadecimalStringFromData(nonceSignature)
        let passRequest = PKAddPaymentPassRequest()
          
        let bodyData: [String: Any] = [
            "cardId": identifier,
            "certificates": convertDataArrayToJSONArray(certificates),
            "nonce": nonceHex,
            "nonceSignature": nonceSignatureHex
        ]
          
        do {
          let jsonData = try JSONSerialization.data(withJSONObject: bodyData, options: [])
          request.httpBody = jsonData
          request.setValue("application/json", forHTTPHeaderField: "Content-Type")

          let (data, response) = try await URLSession.shared.data(for: request)
          
            if let responseDict = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
                let activationDataString = responseDict["activationData"] as? String,
                let ephemeralPublicKeyString = responseDict["ephemeralPublicKey"] as? String,
                let encryptedPassDataString = responseDict["encryptedPassData"] as? String {

                passRequest.activationData = Data(base64Encoded: activationDataString)
                passRequest.ephemeralPublicKey = Data(base64Encoded: ephemeralPublicKeyString)
                passRequest.encryptedPassData = Data(base64Encoded: encryptedPassDataString)

                return passRequest
            } else {
                return passRequest
            }
        } catch {
            return passRequest
        }
        return passRequest
    }

    // MARK: - Private methods

    private func convertDataArrayToJSONArray(_ dataArray: [Data]) -> [String] {
        return dataArray.map { $0.base64EncodedString() }
    }
    
    private func hexadecimalStringFromData(_ data: Data) -> String {
        return data.map { String(format: "%02x", $0) }.joined()
    }
  
    /// Fetch the list of cards from the backend and return to the Wallet API
    private func getPassEntries(passes: [PKSecureElementPass]) async -> [PKIssuerProvisioningExtensionPassEntry] {
      guard let cards = await fetchCardsFromMyAPI(customerId: (userDefaults?.string(forKey: "customerId"))!) else {
            return []
        }

        var filteredCards = cards.filter { $0.status == "CARD_OK" }

        passes.forEach { pass in
            filteredCards.removeAll { card in
                let lastFourDigits = card.maskedCardNumber.suffix(4)
                return pass.primaryAccountNumberSuffix == lastFourDigits
            }
        }

        let passEntries = filteredCards.compactMap { card -> PKIssuerProvisioningExtensionPaymentPassEntry? in
            guard let requestConfiguration = PKAddPaymentPassRequestConfiguration(encryptionScheme: .ECC_V2) else {
                return nil
            }

            requestConfiguration.cardholderName = userDefaults?.string(forKey: "fullName")
            requestConfiguration.primaryAccountSuffix = String(card.maskedCardNumber.suffix(4))
            requestConfiguration.paymentNetwork = .visa
//          requestConfiguration.primaryAccountIdentifier = card.id
            
            return PKIssuerProvisioningExtensionPaymentPassEntry(
                identifier: card.id,
                title: "Whipapp Card",
                art: loadCardArt(),
                addRequestConfiguration: requestConfiguration
            )
        }
        return passEntries
    }

    struct Card: Decodable {
        var accountId: String
        var cardRole: String
        var customerId: String
        var embossing: Embossing?    
        var id: String
        var maskedCardNumber: String
        var productCode: String
        var status: String
        var statusDate: String
        var template: String
        struct Embossing: Codable {
            var companyName: String?
            var firstName: String?
            var lastName: String?
        }
    }

    private func fetchCardsFromMyAPI(customerId: String) async -> [Card]? {
        guard let url = URL(string: "https://getcardsbycustomerid-qsezx5zk6a-nw.a.run.app?customerId=\(customerId)") else {
            print("Invalid URL")
            return nil
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"

        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
                print("Error with the response, unexpected status code: \((response as? HTTPURLResponse)?.statusCode ?? 0)")
                return nil
            }
            // if let stringData = String(data: data, encoding: .utf8) {
            //     userDefaults?.set(stringData, forKey: "logApi")
            // }
            let cards = try JSONDecoder().decode([Card].self, from: data)
            return cards
        } catch {
            print("Networking error: \(error)")
            return nil
        }
    }

    /// Loads an image from the assets and convert to `CGImage`
    private func loadCardArt() -> CGImage {
        var imageName: String
        imageName = "virtual_card"
        if let image = UIImage(named: imageName), let cgImage = image.cgImage {
            return cgImage
        }
        return UIImage(systemName: "square.grid.2x2.fill")!.cgImage!
    }

}
