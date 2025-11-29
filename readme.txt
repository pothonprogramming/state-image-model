State Image Model

The goal of this project is to present a reasonable way to represent an application's state
in the form of a contiguous array buffer that can be used at runtime as well as be serialized
to a binary file for later use.

Using a byte buffer is a simple way to represent memory in most programming languages. 
The buffer must have a small header, a metadata segment, and a data segment to facilitate access.
Accessing data requires use of the metadata, so there is some overhead with this approach.
Different array views may be used to read different types of data.
For simplicity, all metadata properties may be stored as Uint32 values.

The buffer structure might look like this: Header | Metadata | Data

A basic metadata entry might look like this:

id:         Used to find and identify the metadata entry and optionally infer type
dataOffset: Used by the typed view to access the first data element
dataLength: Used by the typed view to access the last data element relative to the dataOffset

Optional properties

dataType:   Used to determine which typed view to use if type is not inferred from id
dataStride: The size of a single data entry in bytes, including any padding
parentId:   Used to build relationships between metadata entries
dataCount:  Used to determine how many data elements are actively being used (for data pools)