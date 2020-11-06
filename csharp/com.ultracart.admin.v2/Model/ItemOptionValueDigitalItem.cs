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
    /// ItemOptionValueDigitalItem
    /// </summary>
    [DataContract]
    public partial class ItemOptionValueDigitalItem :  IEquatable<ItemOptionValueDigitalItem>, IValidatableObject
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ItemOptionValueDigitalItem" /> class.
        /// </summary>
        /// <param name="DigitalItemOid">Digital item object identifier.</param>
        /// <param name="OriginalFilename">Original filename.</param>
        public ItemOptionValueDigitalItem(int? DigitalItemOid = default(int?), string OriginalFilename = default(string))
        {
            this.DigitalItemOid = DigitalItemOid;
            this.OriginalFilename = OriginalFilename;
        }
        
        /// <summary>
        /// Digital item object identifier
        /// </summary>
        /// <value>Digital item object identifier</value>
        [DataMember(Name="digital_item_oid", EmitDefaultValue=false)]
        public int? DigitalItemOid { get; set; }

        /// <summary>
        /// Original filename
        /// </summary>
        /// <value>Original filename</value>
        [DataMember(Name="original_filename", EmitDefaultValue=false)]
        public string OriginalFilename { get; set; }

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class ItemOptionValueDigitalItem {\n");
            sb.Append("  DigitalItemOid: ").Append(DigitalItemOid).Append("\n");
            sb.Append("  OriginalFilename: ").Append(OriginalFilename).Append("\n");
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
            return this.Equals(input as ItemOptionValueDigitalItem);
        }

        /// <summary>
        /// Returns true if ItemOptionValueDigitalItem instances are equal
        /// </summary>
        /// <param name="input">Instance of ItemOptionValueDigitalItem to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(ItemOptionValueDigitalItem input)
        {
            if (input == null)
                return false;

            return 
                (
                    this.DigitalItemOid == input.DigitalItemOid ||
                    (this.DigitalItemOid != null &&
                    this.DigitalItemOid.Equals(input.DigitalItemOid))
                ) && 
                (
                    this.OriginalFilename == input.OriginalFilename ||
                    (this.OriginalFilename != null &&
                    this.OriginalFilename.Equals(input.OriginalFilename))
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
                if (this.DigitalItemOid != null)
                    hashCode = hashCode * 59 + this.DigitalItemOid.GetHashCode();
                if (this.OriginalFilename != null)
                    hashCode = hashCode * 59 + this.OriginalFilename.GetHashCode();
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
