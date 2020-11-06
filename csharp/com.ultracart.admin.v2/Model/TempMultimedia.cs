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
    /// TempMultimedia
    /// </summary>
    [DataContract]
    public partial class TempMultimedia :  IEquatable<TempMultimedia>, IValidatableObject
    {
        /// <summary>
        /// Multimedia type
        /// </summary>
        /// <value>Multimedia type</value>
        [JsonConverter(typeof(StringEnumConverter))]
        public enum MultimediaTypeEnum
        {
            
            /// <summary>
            /// Enum Image for "Image"
            /// </summary>
            [EnumMember(Value = "Image")]
            Image,
            
            /// <summary>
            /// Enum PDF for "PDF"
            /// </summary>
            [EnumMember(Value = "PDF")]
            PDF,
            
            /// <summary>
            /// Enum Text for "Text"
            /// </summary>
            [EnumMember(Value = "Text")]
            Text,
            
            /// <summary>
            /// Enum Video for "Video"
            /// </summary>
            [EnumMember(Value = "Video")]
            Video
        }

        /// <summary>
        /// Multimedia type
        /// </summary>
        /// <value>Multimedia type</value>
        [DataMember(Name="multimedia_type", EmitDefaultValue=false)]
        public MultimediaTypeEnum? MultimediaType { get; set; }
        /// <summary>
        /// Initializes a new instance of the <see cref="TempMultimedia" /> class.
        /// </summary>
        /// <param name="Filename">Filename.</param>
        /// <param name="Height">Height.</param>
        /// <param name="MultimediaType">Multimedia type.</param>
        /// <param name="Size">Size.</param>
        /// <param name="TempMultimediaOid">Temporary multimedia object identifier.</param>
        /// <param name="Url">URL.</param>
        /// <param name="Width">Width.</param>
        public TempMultimedia(string Filename = default(string), int? Height = default(int?), MultimediaTypeEnum? MultimediaType = default(MultimediaTypeEnum?), long? Size = default(long?), int? TempMultimediaOid = default(int?), string Url = default(string), int? Width = default(int?))
        {
            this.Filename = Filename;
            this.Height = Height;
            this.MultimediaType = MultimediaType;
            this.Size = Size;
            this.TempMultimediaOid = TempMultimediaOid;
            this.Url = Url;
            this.Width = Width;
        }
        
        /// <summary>
        /// Filename
        /// </summary>
        /// <value>Filename</value>
        [DataMember(Name="filename", EmitDefaultValue=false)]
        public string Filename { get; set; }

        /// <summary>
        /// Height
        /// </summary>
        /// <value>Height</value>
        [DataMember(Name="height", EmitDefaultValue=false)]
        public int? Height { get; set; }


        /// <summary>
        /// Size
        /// </summary>
        /// <value>Size</value>
        [DataMember(Name="size", EmitDefaultValue=false)]
        public long? Size { get; set; }

        /// <summary>
        /// Temporary multimedia object identifier
        /// </summary>
        /// <value>Temporary multimedia object identifier</value>
        [DataMember(Name="temp_multimedia_oid", EmitDefaultValue=false)]
        public int? TempMultimediaOid { get; set; }

        /// <summary>
        /// URL
        /// </summary>
        /// <value>URL</value>
        [DataMember(Name="url", EmitDefaultValue=false)]
        public string Url { get; set; }

        /// <summary>
        /// Width
        /// </summary>
        /// <value>Width</value>
        [DataMember(Name="width", EmitDefaultValue=false)]
        public int? Width { get; set; }

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class TempMultimedia {\n");
            sb.Append("  Filename: ").Append(Filename).Append("\n");
            sb.Append("  Height: ").Append(Height).Append("\n");
            sb.Append("  MultimediaType: ").Append(MultimediaType).Append("\n");
            sb.Append("  Size: ").Append(Size).Append("\n");
            sb.Append("  TempMultimediaOid: ").Append(TempMultimediaOid).Append("\n");
            sb.Append("  Url: ").Append(Url).Append("\n");
            sb.Append("  Width: ").Append(Width).Append("\n");
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
            return this.Equals(input as TempMultimedia);
        }

        /// <summary>
        /// Returns true if TempMultimedia instances are equal
        /// </summary>
        /// <param name="input">Instance of TempMultimedia to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(TempMultimedia input)
        {
            if (input == null)
                return false;

            return 
                (
                    this.Filename == input.Filename ||
                    (this.Filename != null &&
                    this.Filename.Equals(input.Filename))
                ) && 
                (
                    this.Height == input.Height ||
                    (this.Height != null &&
                    this.Height.Equals(input.Height))
                ) && 
                (
                    this.MultimediaType == input.MultimediaType ||
                    (this.MultimediaType != null &&
                    this.MultimediaType.Equals(input.MultimediaType))
                ) && 
                (
                    this.Size == input.Size ||
                    (this.Size != null &&
                    this.Size.Equals(input.Size))
                ) && 
                (
                    this.TempMultimediaOid == input.TempMultimediaOid ||
                    (this.TempMultimediaOid != null &&
                    this.TempMultimediaOid.Equals(input.TempMultimediaOid))
                ) && 
                (
                    this.Url == input.Url ||
                    (this.Url != null &&
                    this.Url.Equals(input.Url))
                ) && 
                (
                    this.Width == input.Width ||
                    (this.Width != null &&
                    this.Width.Equals(input.Width))
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
                if (this.Filename != null)
                    hashCode = hashCode * 59 + this.Filename.GetHashCode();
                if (this.Height != null)
                    hashCode = hashCode * 59 + this.Height.GetHashCode();
                if (this.MultimediaType != null)
                    hashCode = hashCode * 59 + this.MultimediaType.GetHashCode();
                if (this.Size != null)
                    hashCode = hashCode * 59 + this.Size.GetHashCode();
                if (this.TempMultimediaOid != null)
                    hashCode = hashCode * 59 + this.TempMultimediaOid.GetHashCode();
                if (this.Url != null)
                    hashCode = hashCode * 59 + this.Url.GetHashCode();
                if (this.Width != null)
                    hashCode = hashCode * 59 + this.Width.GetHashCode();
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
            // Filename (string) maxLength
            if(this.Filename != null && this.Filename.Length > 75)
            {
                yield return new System.ComponentModel.DataAnnotations.ValidationResult("Invalid value for Filename, length must be less than 75.", new [] { "Filename" });
            }

            yield break;
        }
    }

}
