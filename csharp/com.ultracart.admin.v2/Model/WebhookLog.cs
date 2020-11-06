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
    /// WebhookLog
    /// </summary>
    [DataContract]
    public partial class WebhookLog :  IEquatable<WebhookLog>, IValidatableObject
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="WebhookLog" /> class.
        /// </summary>
        /// <param name="DeliveryDts">Date/time of delivery.</param>
        /// <param name="Duration">Number of milliseconds to process the notification.</param>
        /// <param name="Request">Request payload (first 100,000 characters).</param>
        /// <param name="RequestHeaders">Request headers sent to the server.</param>
        /// <param name="RequestId">Request id is a unique string that you can look up in the logs.</param>
        /// <param name="Response">Response payload (first 100,000 characters).</param>
        /// <param name="ResponseHeaders">Response headers received from the server.</param>
        /// <param name="StatusCode">HTTP status code received from the server.</param>
        /// <param name="Success">True if the delivery was successful.</param>
        /// <param name="Uri">URI of the webhook delivered to.</param>
        public WebhookLog(string DeliveryDts = default(string), int? Duration = default(int?), string Request = default(string), List<HTTPHeader> RequestHeaders = default(List<HTTPHeader>), string RequestId = default(string), string Response = default(string), List<HTTPHeader> ResponseHeaders = default(List<HTTPHeader>), int? StatusCode = default(int?), bool? Success = default(bool?), string Uri = default(string))
        {
            this.DeliveryDts = DeliveryDts;
            this.Duration = Duration;
            this.Request = Request;
            this.RequestHeaders = RequestHeaders;
            this.RequestId = RequestId;
            this.Response = Response;
            this.ResponseHeaders = ResponseHeaders;
            this.StatusCode = StatusCode;
            this.Success = Success;
            this.Uri = Uri;
        }
        
        /// <summary>
        /// Date/time of delivery
        /// </summary>
        /// <value>Date/time of delivery</value>
        [DataMember(Name="delivery_dts", EmitDefaultValue=false)]
        public string DeliveryDts { get; set; }

        /// <summary>
        /// Number of milliseconds to process the notification
        /// </summary>
        /// <value>Number of milliseconds to process the notification</value>
        [DataMember(Name="duration", EmitDefaultValue=false)]
        public int? Duration { get; set; }

        /// <summary>
        /// Request payload (first 100,000 characters)
        /// </summary>
        /// <value>Request payload (first 100,000 characters)</value>
        [DataMember(Name="request", EmitDefaultValue=false)]
        public string Request { get; set; }

        /// <summary>
        /// Request headers sent to the server
        /// </summary>
        /// <value>Request headers sent to the server</value>
        [DataMember(Name="request_headers", EmitDefaultValue=false)]
        public List<HTTPHeader> RequestHeaders { get; set; }

        /// <summary>
        /// Request id is a unique string that you can look up in the logs
        /// </summary>
        /// <value>Request id is a unique string that you can look up in the logs</value>
        [DataMember(Name="request_id", EmitDefaultValue=false)]
        public string RequestId { get; set; }

        /// <summary>
        /// Response payload (first 100,000 characters)
        /// </summary>
        /// <value>Response payload (first 100,000 characters)</value>
        [DataMember(Name="response", EmitDefaultValue=false)]
        public string Response { get; set; }

        /// <summary>
        /// Response headers received from the server
        /// </summary>
        /// <value>Response headers received from the server</value>
        [DataMember(Name="response_headers", EmitDefaultValue=false)]
        public List<HTTPHeader> ResponseHeaders { get; set; }

        /// <summary>
        /// HTTP status code received from the server
        /// </summary>
        /// <value>HTTP status code received from the server</value>
        [DataMember(Name="status_code", EmitDefaultValue=false)]
        public int? StatusCode { get; set; }

        /// <summary>
        /// True if the delivery was successful
        /// </summary>
        /// <value>True if the delivery was successful</value>
        [DataMember(Name="success", EmitDefaultValue=false)]
        public bool? Success { get; set; }

        /// <summary>
        /// URI of the webhook delivered to
        /// </summary>
        /// <value>URI of the webhook delivered to</value>
        [DataMember(Name="uri", EmitDefaultValue=false)]
        public string Uri { get; set; }

        /// <summary>
        /// Returns the string presentation of the object
        /// </summary>
        /// <returns>String presentation of the object</returns>
        public override string ToString()
        {
            var sb = new StringBuilder();
            sb.Append("class WebhookLog {\n");
            sb.Append("  DeliveryDts: ").Append(DeliveryDts).Append("\n");
            sb.Append("  Duration: ").Append(Duration).Append("\n");
            sb.Append("  Request: ").Append(Request).Append("\n");
            sb.Append("  RequestHeaders: ").Append(RequestHeaders).Append("\n");
            sb.Append("  RequestId: ").Append(RequestId).Append("\n");
            sb.Append("  Response: ").Append(Response).Append("\n");
            sb.Append("  ResponseHeaders: ").Append(ResponseHeaders).Append("\n");
            sb.Append("  StatusCode: ").Append(StatusCode).Append("\n");
            sb.Append("  Success: ").Append(Success).Append("\n");
            sb.Append("  Uri: ").Append(Uri).Append("\n");
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
            return this.Equals(input as WebhookLog);
        }

        /// <summary>
        /// Returns true if WebhookLog instances are equal
        /// </summary>
        /// <param name="input">Instance of WebhookLog to be compared</param>
        /// <returns>Boolean</returns>
        public bool Equals(WebhookLog input)
        {
            if (input == null)
                return false;

            return 
                (
                    this.DeliveryDts == input.DeliveryDts ||
                    (this.DeliveryDts != null &&
                    this.DeliveryDts.Equals(input.DeliveryDts))
                ) && 
                (
                    this.Duration == input.Duration ||
                    (this.Duration != null &&
                    this.Duration.Equals(input.Duration))
                ) && 
                (
                    this.Request == input.Request ||
                    (this.Request != null &&
                    this.Request.Equals(input.Request))
                ) && 
                (
                    this.RequestHeaders == input.RequestHeaders ||
                    this.RequestHeaders != null &&
                    this.RequestHeaders.SequenceEqual(input.RequestHeaders)
                ) && 
                (
                    this.RequestId == input.RequestId ||
                    (this.RequestId != null &&
                    this.RequestId.Equals(input.RequestId))
                ) && 
                (
                    this.Response == input.Response ||
                    (this.Response != null &&
                    this.Response.Equals(input.Response))
                ) && 
                (
                    this.ResponseHeaders == input.ResponseHeaders ||
                    this.ResponseHeaders != null &&
                    this.ResponseHeaders.SequenceEqual(input.ResponseHeaders)
                ) && 
                (
                    this.StatusCode == input.StatusCode ||
                    (this.StatusCode != null &&
                    this.StatusCode.Equals(input.StatusCode))
                ) && 
                (
                    this.Success == input.Success ||
                    (this.Success != null &&
                    this.Success.Equals(input.Success))
                ) && 
                (
                    this.Uri == input.Uri ||
                    (this.Uri != null &&
                    this.Uri.Equals(input.Uri))
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
                if (this.DeliveryDts != null)
                    hashCode = hashCode * 59 + this.DeliveryDts.GetHashCode();
                if (this.Duration != null)
                    hashCode = hashCode * 59 + this.Duration.GetHashCode();
                if (this.Request != null)
                    hashCode = hashCode * 59 + this.Request.GetHashCode();
                if (this.RequestHeaders != null)
                    hashCode = hashCode * 59 + this.RequestHeaders.GetHashCode();
                if (this.RequestId != null)
                    hashCode = hashCode * 59 + this.RequestId.GetHashCode();
                if (this.Response != null)
                    hashCode = hashCode * 59 + this.Response.GetHashCode();
                if (this.ResponseHeaders != null)
                    hashCode = hashCode * 59 + this.ResponseHeaders.GetHashCode();
                if (this.StatusCode != null)
                    hashCode = hashCode * 59 + this.StatusCode.GetHashCode();
                if (this.Success != null)
                    hashCode = hashCode * 59 + this.Success.GetHashCode();
                if (this.Uri != null)
                    hashCode = hashCode * 59 + this.Uri.GetHashCode();
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
