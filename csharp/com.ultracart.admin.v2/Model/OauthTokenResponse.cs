/* 
 * UltraCart Rest API V2
 *
 * This is the next generation UltraCart REST API...
 *
 * OpenAPI spec version: 2.0.0
 * Contact: support@ultracart.com
 * Generated by: https://github.com/swagger-api/swagger-codegen.git
 */

using System;
using System.Linq;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.ComponentModel.DataAnnotations;
using SwaggerDateConverter = com.ultracart.admin.v2.Client.SwaggerDateConverter;

namespace com.ultracart.admin.v2.Model
{
    /// <summary>
    /// OauthTokenResponse
    /// </summary>
    [DataContract]
    public partial class OauthTokenResponse :  IEquatable<OauthTokenResponse>, IValidatableObject
    {
        /// <summary>
        /// Type of token
        /// </summary>
        /// <value>Type of token</value>
        [JsonConverter(typeof(StringEnumConverter))]
        public enum TokenTypeEnum
        {
            
            /// <summary>
            /// Enum Bearer for "bearer"
            /// </summary>
            [EnumMember(Value = "bearer")]
            Bearer
        }

        /// <summary>
        /// Type of token
        /// </summary>
        /// <value>Type of token</value>
        [DataMember(Name="token_type", EmitDefaultValue=false)]
        public TokenTypeEnum? TokenType { get; set; }
        /// <summary>
        /// Initializes a new instance of the <see cref="OauthTokenResponse" /> class.
        /// </summary>
        /// <param name="AccessToken">Access token to use in OAuth authenticated API call.</param>
        /// <param name="Error">Error.</param>
        /// <param name="ErrorDescription">ErrorDescription.</param>
        /// <param name="ErrorUri">ErrorUri.</param>
        /// <param name="ExpiresIn">The number of seconds since issuance when the access token will expire and need to be refreshed using the refresh token.</param>
        /// <param name="RefreshToken">The refresh token that should be used to fetch a new access token when the expiration occurs.</param>
        /// <param name="Scope">The scope of permissions associated with teh access token.</param>
        /// <param name="TokenType">Type of token.</param>
        public OauthTokenResponse(string AccessToken = default(string), string Error = default(string), string ErrorDescription = default(string), string ErrorUri = default(string), string ExpiresIn = default(string), string RefreshToken = default(string), string Scope = default(string), TokenTypeEnum? TokenType = default(TokenTypeEnum?))
        {
            this.AccessToken = AccessToken;
            this.Error = Error;
            this.ErrorDescription = ErrorDescription;
            this.ErrorUri = ErrorUri;
            this.ExpiresIn = ExpiresIn;
            this.RefreshToken = RefreshToken;
            this.Scope = Scope;
            this.TokenType = TokenType;
        }
        
        /// <summary>
        /// Access token to use in OAuth authenticated API call
        /// </summary>
        /// <value>Access token to use in OAuth authenticated API call</value>
        [DataMember(Name="access_token", EmitDefaultValue=false)]
        public string AccessToken { get; set; }

        /// <summary>
        /// Gets or Sets Error
        /// </summary>
        [DataMember(Name="error", EmitDefaultValue=false)]
        public string Error { get; set; }

        /// <summary>
        /// Gets or Sets ErrorDescription
        /// </summary>
        [DataMember(Name="error_description", EmitDefaultValue=false)]
        public string ErrorDescription { get; set; }

        /// <summary>
        /// Gets or Sets ErrorUri
        /// </summary>
        [DataMember(Name="error_uri", EmitDefaultValue=false)]
        public string ErrorUri { get; set; }

        /// <summary>
        /// The number of seconds since issuance when the access token will expire and need to be refreshed using the refresh token
        /// </summary>
        /// <value>The number of seconds since issuance when the access token will expire and need to be refreshed using the refresh token</value>
        [DataMember(Name="expires_in", EmitDefaultValue=false)]
        public string ExpiresIn { get; set; }

        /// <summary>
        /// The refresh token that should be used to fetch a new access token when the expiration occurs
        /// </summary>
        /// <value>The refresh token that should be used to fetch a new access token when the expiration occurs</value>
        [DataMember(Name="refresh_token", EmitDefaultValue=false)]
        public string RefreshToken { get; set; }

        /// <summary>
        /// The scope of permissions associated with teh access token
        /// </summary>
        /// <value>The scope of permissions associated with teh access token</value>
        [DataMember(Name="scope", EmitDefaultValue=false)]
        public string Scope { get; set; }


        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class OauthTokenResponse {\n");
            sb.Append("  AccessToken: ").Append(AccessToken).Append("\n");
            sb.Append("  Error: ").Append(Error).Append("\n");
            sb.Append("  ErrorDescription: ").Append(ErrorDescription).Append("\n");
            sb.Append("  ErrorUri: ").Append(ErrorUri).Append("\n");
            sb.Append("  ExpiresIn: ").Append(ExpiresIn).Append("\n");
            sb.Append("  RefreshToken: ").Append(RefreshToken).Append("\n");
            sb.Append("  Scope: ").Append(Scope).Append("\n");
            sb.Append("  TokenType: ").Append(TokenType).Append("\n");
            sb.Append("}\n");
            return sb.ToString();
        }
  
        /// <summary>
        /// Returns the JSON string presentation of the object
        /// </summary>
        /// <returns>JSON string presentation of the object</returns>
        public string ToJson()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }

        /// <summary>
        /// Returns true if objects are equal
        /// </summary>
        /// <param name="input">Object to be compared</param>
        /// <returns>Boolean</returns>
        public override bool Equals(object input)
        {
            return this.Equals(input as OauthTokenResponse);
        }

        /// <summary>
        /// Returns true if OauthTokenResponse instances are equal
        /// </summary>
        /// <param name="input">Instance of OauthTokenResponse to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(OauthTokenResponse input)
        {
            if (input == null)
                return false;

            return 
                (
                    this.AccessToken == input.AccessToken ||
                    (this.AccessToken != null &&
                    this.AccessToken.Equals(input.AccessToken))
                ) && 
                (
                    this.Error == input.Error ||
                    (this.Error != null &&
                    this.Error.Equals(input.Error))
                ) && 
                (
                    this.ErrorDescription == input.ErrorDescription ||
                    (this.ErrorDescription != null &&
                    this.ErrorDescription.Equals(input.ErrorDescription))
                ) && 
                (
                    this.ErrorUri == input.ErrorUri ||
                    (this.ErrorUri != null &&
                    this.ErrorUri.Equals(input.ErrorUri))
                ) && 
                (
                    this.ExpiresIn == input.ExpiresIn ||
                    (this.ExpiresIn != null &&
                    this.ExpiresIn.Equals(input.ExpiresIn))
                ) && 
                (
                    this.RefreshToken == input.RefreshToken ||
                    (this.RefreshToken != null &&
                    this.RefreshToken.Equals(input.RefreshToken))
                ) && 
                (
                    this.Scope == input.Scope ||
                    (this.Scope != null &&
                    this.Scope.Equals(input.Scope))
                ) && 
                (
                    this.TokenType == input.TokenType ||
                    (this.TokenType != null &&
                    this.TokenType.Equals(input.TokenType))
                );
        }

        /// <summary>
        /// Gets the hash code
        /// </summary>
        /// <returns>Hash code</returns>
        public override int GetHashCode()
        {
            unchecked // Overflow is fine, just wrap
            {
                int hashCode = 41;
                if (this.AccessToken != null)
                    hashCode = hashCode * 59 + this.AccessToken.GetHashCode();
                if (this.Error != null)
                    hashCode = hashCode * 59 + this.Error.GetHashCode();
                if (this.ErrorDescription != null)
                    hashCode = hashCode * 59 + this.ErrorDescription.GetHashCode();
                if (this.ErrorUri != null)
                    hashCode = hashCode * 59 + this.ErrorUri.GetHashCode();
                if (this.ExpiresIn != null)
                    hashCode = hashCode * 59 + this.ExpiresIn.GetHashCode();
                if (this.RefreshToken != null)
                    hashCode = hashCode * 59 + this.RefreshToken.GetHashCode();
                if (this.Scope != null)
                    hashCode = hashCode * 59 + this.Scope.GetHashCode();
                if (this.TokenType != null)
                    hashCode = hashCode * 59 + this.TokenType.GetHashCode();
                return hashCode;
            }
        }

        /// <summary>
        /// To validate all properties of the instance
        /// </summary>
        /// <param name="validationContext">Validation context</param>
        /// <returns>Validation Result</returns>
        IEnumerable<System.ComponentModel.DataAnnotations.ValidationResult> IValidatableObject.Validate(ValidationContext validationContext)
        {
            yield break;
        }
    }

}
