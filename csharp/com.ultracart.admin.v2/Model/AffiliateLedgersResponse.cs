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
    /// AffiliateLedgersResponse
    /// </summary>
    [DataContract]
    public partial class AffiliateLedgersResponse :  IEquatable<AffiliateLedgersResponse>, IValidatableObject
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AffiliateLedgersResponse" /> class.
        /// </summary>
        /// <param name="Error">Error.</param>
        /// <param name="Ledgers">ledgers.</param>
        /// <param name="Metadata">Metadata.</param>
        /// <param name="Success">Indicates if API call was successful.</param>
        public AffiliateLedgersResponse(Error Error = default(Error), List<AffiliateLedger> Ledgers = default(List<AffiliateLedger>), ResponseMetadata Metadata = default(ResponseMetadata), bool? Success = default(bool?))
        {
            this.Error = Error;
            this.Ledgers = Ledgers;
            this.Metadata = Metadata;
            this.Success = Success;
        }
        
        /// <summary>
        /// Gets or Sets Error
        /// </summary>
        [DataMember(Name="error", EmitDefaultValue=false)]
        public Error Error { get; set; }

        /// <summary>
        /// ledgers
        /// </summary>
        /// <value>ledgers</value>
        [DataMember(Name="ledgers", EmitDefaultValue=false)]
        public List<AffiliateLedger> Ledgers { get; set; }

        /// <summary>
        /// Gets or Sets Metadata
        /// </summary>
        [DataMember(Name="metadata", EmitDefaultValue=false)]
        public ResponseMetadata Metadata { get; set; }

        /// <summary>
        /// Indicates if API call was successful
        /// </summary>
        /// <value>Indicates if API call was successful</value>
        [DataMember(Name="success", EmitDefaultValue=false)]
        public bool? Success { get; set; }

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class AffiliateLedgersResponse {\n");
            sb.Append("  Error: ").Append(Error).Append("\n");
            sb.Append("  Ledgers: ").Append(Ledgers).Append("\n");
            sb.Append("  Metadata: ").Append(Metadata).Append("\n");
            sb.Append("  Success: ").Append(Success).Append("\n");
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
            return this.Equals(input as AffiliateLedgersResponse);
        }

        /// <summary>
        /// Returns true if AffiliateLedgersResponse instances are equal
        /// </summary>
        /// <param name="input">Instance of AffiliateLedgersResponse to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(AffiliateLedgersResponse input)
        {
            if (input == null)
                return false;

            return 
                (
                    this.Error == input.Error ||
                    (this.Error != null &&
                    this.Error.Equals(input.Error))
                ) && 
                (
                    this.Ledgers == input.Ledgers ||
                    this.Ledgers != null &&
                    this.Ledgers.SequenceEqual(input.Ledgers)
                ) && 
                (
                    this.Metadata == input.Metadata ||
                    (this.Metadata != null &&
                    this.Metadata.Equals(input.Metadata))
                ) && 
                (
                    this.Success == input.Success ||
                    (this.Success != null &&
                    this.Success.Equals(input.Success))
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
                if (this.Error != null)
                    hashCode = hashCode * 59 + this.Error.GetHashCode();
                if (this.Ledgers != null)
                    hashCode = hashCode * 59 + this.Ledgers.GetHashCode();
                if (this.Metadata != null)
                    hashCode = hashCode * 59 + this.Metadata.GetHashCode();
                if (this.Success != null)
                    hashCode = hashCode * 59 + this.Success.GetHashCode();
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
